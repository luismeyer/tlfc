import { ZodObject, ZodRawShape } from "zod";

import {
  DefaultEndpointType,
  Lambda,
  LambdaCall,
  LambdaOptions,
} from "@tlfc/core";

import { createLambdaFetchCall } from "./create-fetch-call";
import { createLambdaSdkCall } from "./create-sdk-call";

export function createLambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>
): Lambda<RequestSchema, ResponseSchema> {
  const {
    endpointType = DefaultEndpointType,
    functionName,
    httpDisabled = false,
  } = options;

  let call: LambdaCall<RequestSchema, ResponseSchema> | undefined;

  const isBrowser = typeof window !== "undefined";

  if (!httpDisabled && isBrowser) {
    call = createLambdaFetchCall(options);
  }

  if (!isBrowser) {
    call = createLambdaSdkCall(options);
  }

  if (!call) {
    throw new Error(
      "@tlfc: Cannot create lambda call. Are you trying to call a lambda from the browser but set 'httpDisabled' to true?"
    );
  }

  return {
    call,
    endpointType,
    get envVariables(): string[] {
      throw new Error("@tlfc: Cannot access envVariables on the client");
    },
    functionName,
    handler: () => {
      throw new Error("@tlfc: Cannot register lambda handler on the client");
    },
    httpDisabled,
  };
}
