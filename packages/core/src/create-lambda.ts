import { z, ZodObject, ZodRawShape } from "zod";

import { createLambdaHandler, LambdaHandler } from "./server";

import { LambdaOptions } from "./shared";

export type Lambda = {
  // the functionName identifies the location where the lambda can be invoked
  functionName: string;

  handler: LambdaHandler;

  fullFilePath: string;
};

function getCallerFile() {
  let filename = "";

  const _pst = Error.prepareStackTrace;
  Error.prepareStackTrace = (_err, stack) => stack;

  try {
    const err = new Error();

    let callerfile;

    // TODO
    // @ts-ignore
    let currentfile = err.stack?.shift().getFileName();

    while (err.stack?.length) {
      // TODO
      // @ts-ignore
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) {
        filename = callerfile;
        break;
      }
    }
  } catch (err) {}

  Error.prepareStackTrace = _pst;

  return filename;
}

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
): Lambda {
  return {
    functionName: options.functionName,

    handler: createLambdaHandler(handler, options),

    fullFilePath: getCallerFile(),
  };
}
