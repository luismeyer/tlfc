import { ZodObject, ZodRawShape } from "zod";

import { Lambda, LambdaHandler, LambdaOptions } from "@tlfc/core";

import { createLambdaHandler } from "./create-lambda-handler";

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
    fullFilePath: getCallerFile(),
    endpointType: endpointType,
    envVariables: options?.envVariables ?? [],
  };
}
