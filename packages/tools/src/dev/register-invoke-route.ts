import { Application } from "express";
import { ZodObject, ZodRawShape } from "zod";

import { Lambda } from "@tlfc/core";

export function registerInvokeRoute<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(app: Application, functions: Lambda[]) {
  const path = "/2015-03-31/functions/:functionName/invocations";

  console.info(`tlfc: Register invoke route: ${path}`);

  app.post(path, async (request, response) => {
    const { headers, body, params } = request;

    const invocationType = headers["x-amz-invocation-type"];

    const event = body.length > 0 ? JSON.parse(body.toString("utf8")) : {};

    try {
      const lambda = functions.find(
        (lambda) => lambda.functionName === params.functionName
      );

      if (!lambda) {
        throw new Error(`Missing lambda '${params.functionName}' in pool`);
      }

      const resultPromise = lambda.handler(event);

      // Don't await async lambda invocations
      if (invocationType === "Event") {
        return response.status(202).send(JSON.stringify({ StatusCode: 202 }));
      }

      const result = await resultPromise;

      return response.status(200).send(JSON.stringify(result));
    } catch (error) {
      console.error("tlfc: Handler Error", error);

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
