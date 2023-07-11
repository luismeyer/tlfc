import { z, ZodObject, ZodRawShape } from "zod";

import { LambdaOptions } from "../define-lamba-options";
import { createFetchCall } from "./create-fetch-call";
import { createSdkCall } from "./create-sdk-call";

export type Call<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = (request: z.infer<RequestSchema>) => Promise<z.infer<ResponseSchema>>;

export function createLambdaCall<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>({
  functionName,
  responseSchema,
  endpointType,
}: LambdaOptions<RequestSchema, ResponseSchema>): Call<
  RequestSchema,
  ResponseSchema
> {
  return function (request: z.infer<RequestSchema>) {
    let call: Call<RequestSchema, ResponseSchema> | undefined;

    if (typeof window === "undefined") {
      call = createSdkCall(responseSchema, functionName);
    }

    if (endpointType && typeof window === "object") {
      call = createFetchCall(responseSchema, functionName, endpointType);
    }

    if (!call) {
      throw new Error(
        "Could not create call function. Did you forget to set the endpointType on you Lambda?"
      );
    }

    return call(request);
  };
}
