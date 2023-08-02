import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { devConfig } from "@tlfc/core";

import { discoverLambdaEntries } from "../discover-lambda-entries";
import { buildWatch, LambdaOutput } from "../esbuild";
import { loadEnv } from "../load-env";
import { registerApiRoute } from "./register-api-route";
import { registerInvokeRoute } from "./register-invoke-route";
import { disableLogging, log } from "./log";

const { api, invoke } = devConfig;

function createInvokeServer(lambdas: LambdaOutput[]) {
  // this app handles aws-sdk invocations
  const invokeApp = express();
  invokeApp.use(bodyParser.raw());
  invokeApp.use(cors());

  registerInvokeRoute(invokeApp, lambdas);

  return invokeApp.listen(invoke.port, invoke.host, () => {
    log(`invocation Lambdas listening at ${invoke.endpoint}`);
  });
}

function createApiServer(lambdas: LambdaOutput[]) {
  // this app handles fetch invocations
  const apiApp = express();
  apiApp.use(cors());
  apiApp.use(bodyParser.json());

  lambdas.forEach((lambda) => {
    registerApiRoute(apiApp, lambda);
  });

  return apiApp.listen(api.port, api.host, () => {
    log(`api Lambdas listening at ${api.endpoint}`);
  });
}

export type DevOptions = {
  lambdaEntries?: string[];
  quiet?: boolean;
};

export async function dev({ lambdaEntries, quiet }: DevOptions) {
  if (quiet) {
    disableLogging();
  }

  loadEnv();

  let entries = lambdaEntries;
  if (!entries?.length) {
    entries = await discoverLambdaEntries();
  }

  const outputs = await buildWatch(entries);

  const invokeServer = createInvokeServer(outputs);
  const apiServer = createApiServer(outputs);

  let isExiting = false;

  return async () => {
    if (isExiting) {
      return;
    }

    isExiting = true;

    log("stopping dev servers...");

    const invokePromise = new Promise((resolve) => {
      invokeServer.close(resolve);
    });

    const apiPromise = new Promise((resolve) => {
      apiServer.close(resolve);
    });

    await Promise.all([invokePromise, apiPromise]);
  };
}
