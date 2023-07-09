import { z, ZodObject, ZodRawShape } from "zod";

import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { readConfig } from "@tsls/shared";
import { LambdaOptions } from "./shared";

const { api, invoke } = readConfig();

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

function createCallWithAWS<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  responseSchema: ResponseSchema,
  functionName: string
): Call<RequestSchema, ResponseSchema> {
  console.info(`Creating call with AWS for ${functionName}`);

  const client = new LambdaClient({
    region: process.env.REGION,
    endpoint: invoke.endpoint,
  });

  return async function (request: z.infer<RequestSchema>) {
    console.info(`AWS-sdk invoking lambda ${functionName}`);

    const result = await client.send(
      new InvokeCommand({
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify(request)),
      })
    );

    if (!result.Payload) {
      throw new Error(
        `Invoke Lambda Error, missing response payload: ${result.FunctionError}`
      );
    }

    const response = Buffer.from(result.Payload).toString("utf-8");
    const { body } = JSON.parse(response);

    return responseSchema.parse(JSON.parse(body));
  };
}

function createCallWithFetch<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  responseSchema: ResponseSchema,
  functionName: string
): Call<RequestSchema, ResponseSchema> {
  console.info(`Creating call with Fetch for ${functionName}`);

  return async function (request: z.infer<RequestSchema>) {
    console.info(`Fetch invoking lambda`);

    // TODO: base url configurable
    const result = await fetch(`${api.endpoint}/${functionName}`, {
      method: "POST",
      body: JSON.stringify(request),
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

export function createLambdaCall<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>({
  functionName,
  responseSchema,
}: LambdaOptions<RequestSchema, ResponseSchema>): Call<
  RequestSchema,
  ResponseSchema
> {
  return function (request: z.infer<RequestSchema>, { forceFetch } = {}) {
    let call = createCallWithFetch(responseSchema, functionName);

    if (!forceFetch && typeof window === "undefined") {
      call = createCallWithAWS(responseSchema, functionName);
    }

    return call(request);
  };
}
