import { z, ZodObject, ZodRawShape } from "zod";

import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { readConfig } from "@tsls/shared";

import { devLog } from "../logger";
import { Call } from "./create-lambda-call";

export function createSdkCall<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  responseSchema: ResponseSchema,
  functionName: string
): Call<RequestSchema, ResponseSchema> {
  devLog(`Creating call with AWS for ${functionName}`);

  const { invoke } = readConfig();

  const client = new LambdaClient({
    region: process.env.REGION,
    endpoint: invoke?.endpoint,
  });

  return async function (request: z.infer<RequestSchema>) {
    devLog(`AWS-sdk invoking lambda ${functionName}`);

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
