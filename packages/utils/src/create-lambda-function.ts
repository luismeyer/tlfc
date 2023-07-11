import { Stack } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

import { Lambda } from "@tsls/core";

import { lambdaUploadDir } from "./esbuild";

export const handlerFileName = "index";
const handler = `${handlerFileName}.handler`;

export const createLambdaFunction = (
  stack: Stack,
  options: Lambda,
  restApi: RestApi
) => {
  const { functionName } = options;

  const uploadDir = lambdaUploadDir(options);

  const lambda = new Function(stack, functionName, {
    runtime: Runtime.NODEJS_18_X,
    functionName,
    handler,
    code: Code.fromAsset(uploadDir),
  });

  const integration = new LambdaIntegration(lambda);

  restApi.root
    .addResource(functionName, {
      defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS },
    })
    .addMethod(options.endpointType, integration);
};
