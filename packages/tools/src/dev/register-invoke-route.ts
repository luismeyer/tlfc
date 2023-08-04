import { Application } from "express";
import { ZodObject, ZodRawShape } from "zod";

import { createLambdaFunctionName } from "@tlfc/core";

import { LambdaOutput } from "../esbuild";
import { invokeLambda } from "./invoke-lambda";
import { log } from "./log";

export function registerInvokeRoute<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(app: Application, functions: LambdaOutput[]) {
  const path = "/2015-03-31/functions/:functionName/invocations";

  log(`register invoke route: ${path}`);

  app.post(path, async (request, response) => {
    const { headers, body, params } = request;

    const invocationType = headers["x-amz-invocation-type"];

    const event = body.length > 0 ? JSON.parse(body.toString("utf8")) : {};

    try {
      const lambda = functions.find(
        (lambda) =>
          createLambdaFunctionName(lambda.definition.functionName) ===
          params.functionName
      );

      if (!lambda) {
        throw new Error(`Missing lambda '${params.functionName}' in pool`);
      }

      const resultPromise = invokeLambda(lambda, event);

      // Don't await async lambda invocations
      if (invocationType === "Event") {
        return response.status(202).send(JSON.stringify({ StatusCode: 202 }));
      }

      const result = await resultPromise;

      return response.status(200).send(JSON.stringify(result));
    } catch (error) {
      log("handler error", error);

      if (error instanceof Error) {
        return response.status(500).send({
          StatusCode: 500,
          errorMessage: error.message,
          errorType: "Error",
          trace: error.stack?.split("\n"),
        });
      }

      return response.status(500).send({
        StatusCode: 500,
        errorMessage: "Unknown error",
        errorType: "Error",
      });
    }
  });
}
