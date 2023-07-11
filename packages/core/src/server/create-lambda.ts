import { z, ZodObject, ZodRawShape } from "zod";

import { EndpointType, LambdaOptions } from "../define-lamba-options";
import { createLambdaHandler, LambdaHandler } from "./create-lambda-handler";

export type Lambda = {
  // the functionName identifies the location where the lambda can be invoked
  functionName: string;
  handler: LambdaHandler;
  fullFilePath: string;
  endpointType?: EndpointType;
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

export function createLambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>,
  handler: (request: z.infer<RequestSchema>) => Promise<z.infer<ResponseSchema>>
): Lambda {
  return {
    functionName: options.functionName,
    handler: createLambdaHandler(handler, options),
    fullFilePath: getCallerFile(),
    endpointType: options.endpointType,
  };
}
