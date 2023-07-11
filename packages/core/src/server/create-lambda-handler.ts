import { APIGatewayEvent } from "aws-lambda";
import { z, ZodObject, ZodRawShape } from "zod";

import {
  createLambdaErrorResponse,
  createLambdaSuccessResponse,
} from "./lambda-response";
import { devLog } from "../logger";
import { parseEvent } from "./parse-event";
import { LambdaOptions } from "../shared";

export type LambdaHandler = (event: APIGatewayEvent | unknown) => unknown;

export function createLambdaHandler<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  handler: (
    request: z.infer<RequestSchema>
  ) => Promise<z.infer<ResponseSchema>>,

  { functionName, requestSchema }: LambdaOptions<RequestSchema, ResponseSchema>
): LambdaHandler {
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

      return createLambdaErrorResponse(error);
    }
  };
}
