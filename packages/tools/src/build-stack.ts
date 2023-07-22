import { App, Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { config } from "dotenv";

import { AnyLambda } from "./";
import { createLambdaFunction } from "./create-lambda-function";
import { build } from "./esbuild";

class AwsStack extends Stack {
  constructor(app: App, id: string, lambdaOptions: AnyLambda[]) {
    super(app, id);

    const api = new RestApi(this, "tlfcApi", {
      restApiName: "tlfc Api",
      description: "RestApi which holds all tlfc endpoints",
    });

    lambdaOptions.forEach((lambda) => createLambdaFunction(this, lambda, api));
  }
}

export async function buildStack(lambdas: AnyLambda[]) {
  config();

  await build(lambdas);

  const cdkApp = new App();

  return {
    cdkApp,
    stack: new AwsStack(cdkApp, "tlfcStack", lambdas),
  };
}
