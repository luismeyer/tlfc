import {
  DefaultEndpointType,
  RequiredSchemaBase,
  Lambda,
  LambdaFunction,
  LambdaOptions,
  OptionalSchemaBase,
  UndefinedSchemaBase,
} from "@tlfc/core";

import { createLambdaHandler } from "./create-lambda-handler";

export function createLambda<
  RequestSchema extends OptionalSchemaBase = UndefinedSchemaBase,
  ResponseSchema extends RequiredSchemaBase = RequiredSchemaBase
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>,
  handler: LambdaFunction<RequestSchema, ResponseSchema>
): Lambda<RequestSchema, ResponseSchema> {
  const {
    endpointType = DefaultEndpointType,
    envVariables = [],
    functionName,
    httpDisabled = false,
  } = options;

  return {
    call: () => {
      throw new Error(
        "@tlfc: Cannot call lambda in server code. Did you forget to use a @tlfc plugin?"
      );
    },
    endpointType,
    envVariables,
    functionName,
    handler: createLambdaHandler(handler, options),
    httpDisabled,
  };
}
