import { App, Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

import { createAwsLambdaFunction } from "./create-lambda-function";
import { discoverLambdaEntries } from "./discover-lambda-entries";
import { build, LambdaOutput } from "./esbuild";
import { loadEnv } from "./load-env";

class AwsStack extends Stack {
  constructor(app: App, id: string, lambdas: LambdaOutput[]) {
    super(app, id);

    console.info(`@tlfc: creating aws stack: '${id}'`);

    const api = new RestApi(this, "tlfcApi", {
      restApiName: "@tlfc Api",
      description: "RestApi which holds all @tlfc endpoints",
    });

    lambdas.forEach((lambda) => createAwsLambdaFunction(this, api, lambda));
  }
}

export async function buildStack(lambdaEntries?: string[]) {
  loadEnv();

  let entries = lambdaEntries;
  if (!entries?.length) {
    entries = await discoverLambdaEntries();
  }

  if (!entries?.length) {
    throw new Error("@tlfc: Error, no lambda entries found!");
  }

  const outputs = await build(entries);

  const cdkApp = new App();

  return {
    cdkApp,
    stack: new AwsStack(cdkApp, "tlfcStack", outputs),
  };
}
