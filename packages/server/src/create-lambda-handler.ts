import { APIGatewayProxyHandler } from "aws-lambda";

import {
  DefaultEndpointType,
  devLog,
  LambdaFunction,
  LambdaOptions,
  OptionalSchemaBase,
  RequiredSchemaBase,
  SchemaType,
} from "@tlfc/core";

import { EventParseError } from "./event-parse-error";
import {
  createLambdaErrorResponse,
  createLambdaSuccessResponse,
} from "./lambda-response";
import { parseEvent } from "./parse-event";

export function createLambdaHandler<
  RequestSchema extends OptionalSchemaBase,
  ResponseSchema extends RequiredSchemaBase
>(
  handler: LambdaFunction<RequestSchema, ResponseSchema>,
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

    let payload: SchemaType<RequestSchema>;

    try {
      if (requestSchema) {
        payload = parseEvent(event, requestSchema, endpointType);
      } else {
        payload = {};
      }
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
