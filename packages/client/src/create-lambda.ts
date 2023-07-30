import { ZodObject, ZodRawShape } from "zod";

import { Lambda, LambdaOptions } from "@tlfc/core";

import { createLambdaFetchCall } from "./create-fetch-call";
import { createLambdaSdkCall } from "./create-sdk-call";

export function createLambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>
): Lambda<RequestSchema, ResponseSchema> {
  const { functionName, endpointType } = options;

  let call = createLambdaFetchCall(options);

  if (typeof window === "undefined") {
    call = createLambdaSdkCall(options);
  }

  return {
    functionName: functionName,
    handler: () => {
      throw new Error(
        "@tlfc Error: Cannot register lambda handler on the client"
      );
    },
    call,
    endpointType: endpointType,
    envVariables: options?.envVariables ?? [],
  };
}
