import { json, raw } from "body-parser";
import * as cors from "cors";
import { context } from "esbuild";
import * as express from "express";
import { ZodObject, ZodRawShape } from "zod";

import { Lambda } from "@tsls/core";
import { storeDevConfig } from "@tsls/shared";

import { registerApiRoute } from "./register-api-route";
import { registerInvokeRoute } from "./register-invoke-route";

async function build<
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

export async function dev<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(lambdas: Lambda<RequestSchema, ResponseSchema>[]) {
  await build(lambdas);

  const host = "localhost";

  // this app handles aws-sdk invocations
  const invokeApp = express();
  invokeApp.use(raw());
  invokeApp.use(cors());

  registerInvokeRoute(invokeApp, lambdas);

  // this app handles fetch invocations
  const apiApp = express();
  apiApp.use(cors());
  apiApp.use(json());

  lambdas.forEach((lambda) => {
    registerApiRoute(apiApp, lambda);
  });

  const invokePort = 3002;
  const invokeEndpoint = `http://${host}:${invokePort}`;

  const invocationServer = invokeApp.listen(invokePort, host, () => {
    console.info(`Invocation Lambdas at ${invokeEndpoint}`);
  });

  const apiPort = 3000;
  const apiEndpoint = `http://${host}:${apiPort}`;

  const proxyServer = apiApp.listen(apiPort, host, () => {
    console.info(`Api Lambdas at ${apiEndpoint}`);
  });

  storeDevConfig({ invokeEndpoint, apiEndpoint });

  let isExiting = false;

  const handleExit = async () => {
    if (isExiting) {
      return;
    }

    isExiting = true;

    console.info("stopping dev servers...");

    invocationServer.close();
    proxyServer.close();

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
