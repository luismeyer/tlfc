import { App, Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

import { Lambda } from "@tsls/core";

import { createLambdaFunction } from "./create-lambda-function";
import { build } from "./esbuild";

class AwsStack extends Stack {
  constructor(app: App, id: string, lambdas: Lambda[]) {
    super(app, id);

    const api = new RestApi(this, "tSlsApi", {
      restApiName: "tSLS Api",
      description: "RestApi which holds all tSLS endpoints",
    });

    lambdas.forEach((lambda) => createLambdaFunction(this, lambda, api));
  }
}

export function buildStack(lambdas: Lambda[]) {
  build(lambdas);

  const cdkApp = new App();

  return {
    cdkApp,
    stack: new AwsStack(cdkApp, "tSlsStack", lambdas),
  };
}
