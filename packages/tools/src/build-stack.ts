import { App, Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { config } from "dotenv";

import { createLambdaFunction } from "./create-lambda-function";
import { discoverLambdaEntries } from "./discoverLambdaEntries";
import { build, LambdaOutput } from "./esbuild";

class AwsStack extends Stack {
  constructor(app: App, id: string, lambdas: LambdaOutput[]) {
    super(app, id);

    const api = new RestApi(this, "tlfcApi", {
      restApiName: "@tlfc Api",
      description: "RestApi which holds all @tlfc endpoints",
    });

    lambdas.forEach((lambda) => createLambdaFunction(this, api, lambda));
  }
}

export async function buildStack(lambdaEntries?: string[]) {
  config();

  let entries = lambdaEntries;
  if (!entries?.length) {
    entries = await discoverLambdaEntries();
  }

  const outputs = await build(entries);

  const cdkApp = new App();

  return {
    cdkApp,
    stack: new AwsStack(cdkApp, "tlfcStack", outputs),
  };
}
