import { Stack } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

import { Lambda } from "@tlfc/core";

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

  const environment = options.envVariables.reduce(
    (acc, envVar) => ({
      ...acc,
      [envVar]: process.env[envVar],
    }),
    {}
  );

  const lambda = new Function(stack, functionName, {
    runtime: Runtime.NODEJS_18_X,
    functionName,
    handler,
    code: Code.fromAsset(uploadDir),
    environment: {
      ...environment,
      LAMBDA_ENV: "cloud",
    },
  });

  if (options.endpointType && restApi) {
    const integration = new LambdaIntegration(lambda);

    restApi.root
      .addResource(functionName, {
        defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS },
      })
      .addMethod(options.endpointType, integration);
  }

  // TODO: use more granular permissions
  const statement = new PolicyStatement();
  statement.addActions("lambda:InvokeFunction");
  statement.addResources("*");

  lambda.addToRolePolicy(statement);

  return lambda;
};
