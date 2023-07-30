import { ZodObject, ZodRawShape } from "zod";

import { Lambda, LambdaHandler, LambdaOptions } from "@tlfc/core";

import { createLambdaHandler } from "./create-lambda-handler";

export function createLambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>,
  handler: LambdaHandler<RequestSchema, ResponseSchema>
): Lambda<RequestSchema, ResponseSchema> {
  const { functionName, endpointType } = options;

  return {
    functionName: functionName,
    handler: createLambdaHandler(handler, options),
    call: () => {
      throw new Error(
        "@tlfc Error: Cannot call lambda in server code. Did you forget to use a @tlfc plugin?"
      );
    },
    endpointType: endpointType,
    envVariables: options?.envVariables ?? [],
  };
}
