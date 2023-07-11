import { z, ZodObject, ZodRawShape } from "zod";

import { LambdaOptions } from "../shared";
import { createFetchCall } from "./create-fetch-call";
import { createSdkCall } from "./create-sdk-call";

export type CallOptions = {
  forceFetch?: boolean;
};

export type Call<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = (
  request: z.infer<RequestSchema>,
  options?: CallOptions
) => Promise<z.infer<ResponseSchema>>;

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
  return function (request: z.infer<RequestSchema>, { forceFetch } = {}) {
    let call = createFetchCall(responseSchema, functionName, endpointType);

    if (!forceFetch && typeof window === "undefined") {
      call = createSdkCall(responseSchema, functionName);
    }

    return call(request);
  };
}
