import { App, Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { config } from "dotenv";

import { Lambda } from "@tsls/core";

import { createLambdaFunction } from "./create-lambda-function";
import { build } from "./esbuild";

class AwsStack extends Stack {
  constructor(app: App, id: string, lambdaOptions: Lambda[]) {
    super(app, id);

    const api = new RestApi(this, "tSlsApi", {
      restApiName: "tSLS Api",
      description: "RestApi which holds all tSLS endpoints",
    });

    lambdaOptions.forEach((lambda) => createLambdaFunction(this, lambda, api));
  }
}

export function buildStack(lambdas: Lambda[]) {
  config();

  build(lambdas);

  const cdkApp = new App();

  return {
    cdkApp,
    stack: new AwsStack(cdkApp, "tSlsStack", lambdas),
  };
}
