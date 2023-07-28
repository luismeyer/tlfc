import { APIGatewayProxyHandler } from "aws-lambda";
import { z, ZodObject, ZodRawShape } from "zod";

import {
  DefaultEndpointType,
  devLog,
  LambdaHandler,
  LambdaOptions,
} from "@tlfc/core";

import {
  createLambdaErrorResponse,
  createLambdaSuccessResponse,
} from "./lambda-response";
import { parseEvent } from "./parse-event";
import { EventParseError } from "./event-parse-error";

export function createLambdaHandler<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  handler: LambdaHandler<RequestSchema, ResponseSchema>,
  {
    functionName,
    requestSchema,
    endpointType = DefaultEndpointType,
  }: LambdaOptions<RequestSchema, ResponseSchema>
): APIGatewayProxyHandler {
  devLog("Creating lambda Wrapper for ", functionName);

  return async function (event) {
    devLog("Running lambda ", functionName);

    if (!event || typeof event !== "object") {
      throw new Error("Lambda Event missing");
    }

    let payload: z.TypeOf<RequestSchema>;

    try {
      payload = parseEvent(event, requestSchema, endpointType);
    } catch (error) {
      if (error instanceof EventParseError) {
        return createLambdaErrorResponse(error.response);
      }

      return createLambdaErrorResponse({ error: "Cannot parse event" });
    }

    try {
      const result = await handler(payload);

      return createLambdaSuccessResponse(result);
    } catch (lambdaError) {
      devLog("Lambda Execution Error", lambdaError);

      let error: unknown = lambdaError;

      if (lambdaError instanceof Error) {
        error = lambdaError.message;
      }

      return createLambdaErrorResponse({ error });
    }
  };
}
