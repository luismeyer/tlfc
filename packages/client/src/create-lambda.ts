import {
  DefaultEndpointType,
  RequiredSchemaBase,
  Lambda,
  LambdaFunction,
  LambdaOptions,
  OptionalSchemaBase,
  UndefinedSchemaBase,
} from "@tlfc/core";

import { createFetchCall } from "./create-fetch-call";
import { createSdkCall } from "./create-sdk-call";

export function createLambda<
  RequestSchema extends OptionalSchemaBase = UndefinedSchemaBase,
  ResponseSchema extends RequiredSchemaBase = RequiredSchemaBase
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>
): Lambda<RequestSchema, ResponseSchema> {
  const {
    endpointType = DefaultEndpointType,
    functionName,
    httpDisabled = false,
    responseSchema,
  } = options;

  let call: LambdaFunction<RequestSchema, ResponseSchema> | undefined;

  const isBrowser = typeof window !== "undefined";

  if (!httpDisabled && isBrowser) {
    call = createFetchCall(responseSchema, functionName, endpointType);
  }

  if (!isBrowser) {
    call = createSdkCall(responseSchema, functionName);
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
