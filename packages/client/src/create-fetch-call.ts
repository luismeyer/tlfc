import { z, ZodObject, ZodRawShape } from "zod";

import {
  DefaultEndpointType,
  devLog,
  EndpointType,
  LambdaCall,
  LambdaOptions,
  readConfig,
} from "@tlfc/core";

function createUrl<RequestSchema extends ZodObject<ZodRawShape>>(
  functionName: string,
  request: z.infer<RequestSchema>,
  endpointType: EndpointType
): string {
  const { api } = readConfig();
  const base = `${api.endpoint}/${functionName}`;

  if (endpointType !== "GET") {
    return base;
  }

  const params = new URLSearchParams(request).toString();
  const urlParams = params.length ? `?${params}` : "";

  return `${base}${urlParams}`;
}

function createBody<RequestSchema extends ZodObject<ZodRawShape>>(
  request: z.infer<RequestSchema>,
  endpointType: EndpointType
): string | undefined {
  if (endpointType !== "POST") {
    return;
  }

  return JSON.stringify(request);
}

function createFetchCall<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  responseSchema: ResponseSchema,
  functionName: string,
  endpointType: EndpointType
): LambdaCall<RequestSchema, ResponseSchema> {
  devLog(`Creating call with Fetch for ${functionName}`);

  return async function (request: z.infer<RequestSchema>) {
    devLog(`Fetch invoking lambda`);

    const url = createUrl(functionName, request, endpointType);

    const result = await fetch(url, {
      method: endpointType,
      body: createBody(request, endpointType),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await result.json();

    if (!result.ok) {
      throw new Error(JSON.stringify(response, null, 2));
    }

    return responseSchema.parse(response);
  };
}

export function createLambdaFetchCall<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>({
  functionName,
  responseSchema,
  endpointType = DefaultEndpointType,
}: LambdaOptions<RequestSchema, ResponseSchema>): LambdaCall<
  RequestSchema,
  ResponseSchema
> {
  return function (request: z.infer<RequestSchema>) {
    if (!endpointType) {
      throw new Error(
        "Could not create fetch call function. Did you forget to set the endpointType on you Lambda?"
      );
    }

    const call = createFetchCall(responseSchema, functionName, endpointType);

    return call(request);
  };
}
