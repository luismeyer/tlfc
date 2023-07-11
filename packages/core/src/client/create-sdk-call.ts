import { z, ZodObject, ZodRawShape } from "zod";

import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { readConfig } from "@tsls/shared";

import { devLog } from "../logger";
import { Call } from "./create-lambda-call";

function createLambdaClient() {
  const { invoke } = readConfig();
  const { LAMBDA_ENV } = process.env;

  const endpoint = LAMBDA_ENV === "cloud" ? undefined : invoke?.endpoint;

  return new LambdaClient({ endpoint });
}

export function createSdkCall<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  responseSchema: ResponseSchema,
  functionName: string
): Call<RequestSchema, ResponseSchema> {
  devLog(`Creating call with AWS for ${functionName}`);

  const client = createLambdaClient();

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
    const data = JSON.parse(body);

    const parseResult = responseSchema.safeParse(data);

    if (!parseResult.success) {
      throw data;
    }

    return parseResult.data;
  };
}
