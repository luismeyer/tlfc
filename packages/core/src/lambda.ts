import { basename, extname } from "path";
import { z, ZodObject, ZodRawShape } from "zod";

import { Call, createLambdaCall } from "./client";
import { createLambdaHandler, LambdaHandler } from "./server";

export type Lambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = {
  // the functionName identifies the location where the lambda can be invoked
  functionName: string;

  // server side
  handler: LambdaHandler;

  // client side
  call: Call<RequestSchema, ResponseSchema>;

  filename: string;
};

function getCallerFile() {
  let filename = "";

  const _pst = Error.prepareStackTrace;
  Error.prepareStackTrace = (_err, stack) => stack;

  try {
    const err = new Error();

    let callerfile;
    // @ts-ignore
    let currentfile = err.stack?.shift().getFileName();

    while (err.stack?.length) {
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
 * @param responseSchema zod schema to parse incoming responses in the client
 * @param functionName optional name of lambda to determine invocation location
 * @returns
 */
export function createLambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  requestSchema: RequestSchema,
  responseSchema: ResponseSchema,

  handler: (
    request: z.infer<RequestSchema>
  ) => Promise<z.infer<ResponseSchema>>,

  functionName?: string
): Lambda<RequestSchema, ResponseSchema> {
  const callerFile = getCallerFile();

  const filename = basename(callerFile, extname(callerFile));

  functionName = functionName ?? `${filename}-handler`;

  return {
    functionName,

    // server side
    handler: createLambdaHandler(handler, requestSchema, functionName),

    // client side
    call: createLambdaCall(responseSchema, functionName),

    filename: getCallerFile(),
  };
}
