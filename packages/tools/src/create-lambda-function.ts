import { Construct } from "constructs";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

import { LambdaOutput } from "./esbuild";
import { log } from "./dev/log";
import { createLambdaFunctionName } from "@tlfc/core";

export const handlerFileName = "index";
const handler = `${handlerFileName}.default.handler`;

type CreateAwsLambdaFunctionOptions = {
  stack: Construct;
  restApi: RestApi;
  lambdaOutput: LambdaOutput;
  version: string;
};

export const createAwsLambdaFunction = ({
  stack,
  restApi,
  lambdaOutput: { definition, uploadDir },
  version,
}: CreateAwsLambdaFunctionOptions) => {
  const { functionName, envVariables, endpointType, httpDisabled } = definition;

  const name = createLambdaFunctionName(functionName, version);

  log(`creating aws lambda function: '${name}'`);

  const environment = envVariables.reduce(
    (acc, envVar) => ({
      ...acc,
      [envVar]: process.env[envVar],
    }),
    {}
  );

  const awsLambda = new Function(stack, name, {
    runtime: Runtime.NODEJS_18_X,
    functionName: name,
    handler,
    code: Code.fromAsset(uploadDir),
    environment: {
      ...environment,
      // tell the aws-sdk to not use the local config
      LAMBDA_ENV: "cloud",
      VERSION: version,
    },
  });

  if (!httpDisabled) {
    const integration = new LambdaIntegration(awsLambda);

    restApi.root
      .addResource(functionName, {
        defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS },
      })
      .addMethod(endpointType, integration);
  }

  // TODO: use more granular permissions
  const statement = new PolicyStatement();
  statement.addActions("lambda:InvokeFunction");
  statement.addResources("*");

  awsLambda.addToRolePolicy(statement);

  return awsLambda;
};
