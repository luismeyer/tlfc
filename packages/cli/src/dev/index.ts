import { json, raw } from "body-parser";
import cors from "cors";
import { context } from "esbuild";
import express from "express";
import { ZodObject, ZodRawShape } from "zod";

import { Lambda } from "@tsls/core";
import { readConfig } from "@tsls/shared";

import { registerApiRoute } from "./register-api-route";
import { registerInvokeRoute } from "./register-invoke-route";

const { api, invoke } = readConfig();

async function buildWatch<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(lambdas: Lambda<RequestSchema, ResponseSchema>[]) {
  try {
    const buildContext = await context({
      entryPoints: lambdas.map(({ filename }) => filename),
      outdir: `dist`,
      bundle: true,
      platform: `node`,
      target: `node18`,
      format: `cjs`,
      sourcemap: true,
      logLevel: `info`,
    });

    await buildContext.watch();
  } catch {
    process.exit(1);
  }
}

function createInvokeServer<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(lambdas: Lambda<RequestSchema, ResponseSchema>[]) {
  // this app handles aws-sdk invocations
  const invokeApp = express();
  invokeApp.use(raw());
  invokeApp.use(cors());

  registerInvokeRoute(invokeApp, lambdas);

  return invokeApp.listen(invoke.port, invoke.host, () => {
    console.info(`Invocation Lambdas at ${invoke.endpoint}`);
  });
}

function createApiServer<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(lambdas: Lambda<RequestSchema, ResponseSchema>[]) {
  // this app handles fetch invocations
  const apiApp = express();
  apiApp.use(cors());
  apiApp.use(json());

  lambdas.forEach((lambda) => {
    registerApiRoute(apiApp, lambda);
  });

  return apiApp.listen(api.port, api.host, () => {
    console.info(`Api Lambdas at ${api.endpoint}`);
  });
}

export async function dev<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(lambdas: Lambda<RequestSchema, ResponseSchema>[]) {
  await buildWatch(lambdas);

  const invokeServer = createInvokeServer(lambdas);
  const apiServer = createApiServer(lambdas);

  let isExiting = false;

  const handleExit = async () => {
    if (isExiting) {
      return;
    }

    isExiting = true;

    console.info("stopping dev servers...");

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
