import { Stack } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

import { DefaultEndpointType } from "@tlfc/core";

import { LambdaOutput } from "./esbuild";

export const handlerFileName = "index";
const handler = `${handlerFileName}.default.handler`;

export const createLambdaFunction = (
  stack: Stack,
  restApi: RestApi,
  { definition, uploadDir }: LambdaOutput
) => {
  const { functionName, envVariables, endpointType } = definition;

  const environment = envVariables.reduce(
    (acc, envVar) => ({
      ...acc,
      [envVar]: process.env[envVar],
    }),
    {}
  );

  const awsLambda = new Function(stack, functionName, {
    runtime: Runtime.NODEJS_18_X,
    functionName,
    handler,
    code: Code.fromAsset(uploadDir),
    environment: {
      ...environment,
      // tell the aws-sdk to not use the local config
      LAMBDA_ENV: "cloud",
    },
  });

  if (restApi) {
    const integration = new LambdaIntegration(awsLambda);

    restApi.root
      .addResource(functionName, {
        defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS },
      })
      .addMethod(endpointType ?? DefaultEndpointType, integration);
  }

  // TODO: use more granular permissions
  const statement = new PolicyStatement();
  statement.addActions("lambda:InvokeFunction");
  statement.addResources("*");

  awsLambda.addToRolePolicy(statement);

  return awsLambda;
};
