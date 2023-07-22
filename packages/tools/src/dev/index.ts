import { json, raw } from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";

import { devConfig } from "@tlfc/core";

import { AnyLambda } from "../";
import { buildWatch } from "../esbuild";
import { registerApiRoute } from "./register-api-route";
import { registerInvokeRoute } from "./register-invoke-route";

const { api, invoke } = devConfig;

function createInvokeServer(lambdas: AnyLambda[]) {
  // this app handles aws-sdk invocations
  const invokeApp = express();
  invokeApp.use(raw());
  invokeApp.use(cors());

  registerInvokeRoute(invokeApp, lambdas);

  return invokeApp.listen(invoke.port, invoke.host, () => {
    console.info(`tlfc: Invocation Lambdas at ${invoke.endpoint}`);
  });
}

function createApiServer(lambdas: AnyLambda[]) {
  // this app handles fetch invocations
  const apiApp = express();
  apiApp.use(cors());
  apiApp.use(json());

  lambdas.forEach((lambda) => {
    registerApiRoute(apiApp, lambda);
  });

  return apiApp.listen(api.port, api.host, () => {
    console.info(`tlfc: Api Lambdas at ${api.endpoint}`);
  });
}

export async function dev(lambdas: AnyLambda[]) {
  config();

  await buildWatch(lambdas);

  const invokeServer = createInvokeServer(lambdas);
  const apiServer = createApiServer(lambdas);

  let isExiting = false;

  const handleExit = async () => {
    if (isExiting) {
      return;
    }

    isExiting = true;

    console.info("tlfc: stopping dev servers...");

    invokeServer.close();
    apiServer.close();

    process.exit(0);
  };

  //catches ctrl+c event
  process.on("SIGINT", handleExit);

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", handleExit);
  process.on("SIGUSR2", handleExit);

  //catches uncaught exceptions
  process.on("uncaughtException", handleExit);
}
