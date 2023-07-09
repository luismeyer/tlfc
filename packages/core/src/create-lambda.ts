import { z, ZodObject, ZodRawShape } from "zod";

import { createLambdaHandler, LambdaHandler } from "./server";
import { getCallerFile } from "./get-caller-file";
import { LambdaOptions } from "./shared";

export type Lambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = {
  // the functionName identifies the location where the lambda can be invoked
  functionName: string;

  // server side
  handler: LambdaHandler;

  filename: string;
};

/**
 * @param handler Function that handles the request
 * @param requestSchema zod schema to parse incoming requests inside the lambda
 * @param functionName optional name of lambda to determine invocation location
 * @returns
 */
export function createLambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  handler: (
    request: z.infer<RequestSchema>
  ) => Promise<z.infer<ResponseSchema>>,

  options: LambdaOptions<RequestSchema, ResponseSchema>
): Lambda<RequestSchema, ResponseSchema> {
  return {
    functionName: options.functionName,

    // server side
    handler: createLambdaHandler(handler, options),

    filename: getCallerFile(),
  };
}
