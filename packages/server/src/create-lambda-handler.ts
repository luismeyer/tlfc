import { APIGatewayProxyHandler } from "aws-lambda";
import { ZodObject, ZodRawShape } from "zod";

import { devLog, LambdaHandler, LambdaOptions } from "@tlfc/core";

import {
  createLambdaErrorResponse,
  createLambdaSuccessResponse,
} from "./lambda-response";
import { parseEvent } from "./parse-event";

export function createLambdaHandler<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  handler: LambdaHandler<RequestSchema, ResponseSchema>,
  { functionName, requestSchema }: LambdaOptions<RequestSchema, ResponseSchema>
): APIGatewayProxyHandler {
  devLog("Creating lambda Wrapper for ", functionName);

  return async function (event) {
    devLog("Running lambda ", functionName);

    if (!event || typeof event !== "object") {
      throw new Error("Lambda Event missing");
    }

    const payload = parseEvent(event, requestSchema);

    if (!payload) {
      return createLambdaErrorResponse("Cannot parse event");
    }

    try {
      const result = await handler(payload);

      return createLambdaSuccessResponse(result);
    } catch (error) {
      devLog("Lambda Execution Error", error);

      let payload: unknown = error;

      if (error instanceof Error) {
        payload = error.message;
      }

      return createLambdaErrorResponse(payload);
    }
  };
}
