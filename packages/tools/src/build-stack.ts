import { App, Stack } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

import { createAwsLambdaFunction } from "./create-lambda-function";
import { log } from "./dev/log";
import { discoverLambdaEntries } from "./discover-lambda-entries";
import { build, LambdaOutput } from "./esbuild";
import { loadEnv } from "./load-env";
import { DEFAULT_VERSION } from "@tlfc/core";

class AwsStack extends Stack {
  constructor(app: Construct, version: string, lambdas: LambdaOutput[]) {
    const stackId = "tlfc-stack";
    const id = version ? [stackId, version].join("-") : stackId;

    super(app, id);

    log(`creating aws stack: '${id}'`);

    const restApi = new RestApi(this, "tlfcApi", {
      restApiName: `@tlfc Api ${version}`,
      description: "RestApi which holds all @tlfc endpoints",
    });

    lambdas.forEach((lambdaOutput) =>
      createAwsLambdaFunction({ stack: this, restApi, lambdaOutput, version })
    );
  }
}

export type BuildStackOptions = {
  lambdaEntries?: string[];
  app?: Construct;
  version?: string;
};

export async function buildStack({
  app,
  lambdaEntries,
  version = DEFAULT_VERSION,
}: BuildStackOptions = {}) {
  loadEnv();

  let entries = lambdaEntries;
  if (!entries?.length) {
    entries = await discoverLambdaEntries();
  }

  if (!entries?.length) {
    throw new Error("@tlfc: No lambda entries found!");
  }

  const outputs = await build(entries);

  const cdkApp = app ?? new App();

  return {
    cdkApp,
    stack: new AwsStack(cdkApp, version, outputs),
  };
}
