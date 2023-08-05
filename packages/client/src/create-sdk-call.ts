import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  createLambdaFunctionName,
  devLog,
  LambdaFunction,
  readConfig,
  OptionalSchemaBase,
  RequiredSchemaBase,
} from "@tlfc/core";

function createLambdaClient() {
  const { invoke } = readConfig();
  const { LAMBDA_ENV } = process.env;

  const endpoint = LAMBDA_ENV === "cloud" ? undefined : invoke?.endpoint;

  return new LambdaClient({ endpoint });
}

export function createSdkCall<
  RequestSchema extends OptionalSchemaBase,
  ResponseSchema extends RequiredSchemaBase
>(
  responseSchema: ResponseSchema,
  functionName: string
): LambdaFunction<RequestSchema, ResponseSchema> {
  devLog(`Creating call with AWS for ${functionName}`);

  const client = createLambdaClient();

  return async function (request) {
    devLog(`AWS-sdk invoking lambda ${functionName}`);

    const { VERSION } = process.env;

    const result = await client.send(
      new InvokeCommand({
        FunctionName: createLambdaFunctionName(functionName, VERSION),
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify(request)),
      })
    );

    if (!result.Payload) {
      throw new Error(
        `@tlfc: Invoke Lambda error, missing response payload: ${result.FunctionError}`
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
