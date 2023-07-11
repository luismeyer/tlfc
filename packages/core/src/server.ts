import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { z, ZodObject, ZodRawShape } from "zod";

import { devLog } from "./logger";
import { LambdaOptions } from "./shared";

export type LambdaHandler = (event: APIGatewayEvent | unknown) => unknown;

const responseHeaders = {
  "Access-Control-Allow-Origin": `*`,
  "Access-Control-Allow-Credentials": `true`,
  "Access-Control-Expose-Headers": `*`,
  "content-type": `application/json`,
};

function createLambdaSuccessResponse(data: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: responseHeaders,
  };
}

function createLambdaErrorResponse(error: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode: 500,
    body: JSON.stringify(error),
    headers: responseHeaders,
  };
}

const HttpEvent = z.object({
  body: z.string(),
  isBase64Encoded: z.optional(z.boolean()),
});

export function createLambdaHandler<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  handler: (
    request: z.infer<RequestSchema>
  ) => Promise<z.infer<ResponseSchema>>,

  { functionName, requestSchema }: LambdaOptions<RequestSchema, ResponseSchema>
): LambdaHandler {
  devLog("Creating lambda Wrapper for ", functionName);

  return async function (event) {
    devLog("Running lambda ", functionName);

    if (!event || typeof event !== "object") {
      throw new Error("Lambda Event missing");
    }

    let payload: z.infer<RequestSchema>;

    try {
      let { isBase64Encoded, body } = HttpEvent.parse(event);

      if (isBase64Encoded) {
        const buffer = Buffer.from(body, "base64");
        body = buffer.toString("utf-8");
      }

      payload = requestSchema.parse(JSON.parse(body));
    } catch {
      // when invoked with the AWS-sdk the event is already parsed
      try {
        payload = requestSchema.parse(event);
      } catch (error) {
        devLog("Lambda Execution Error", error);

        return createLambdaErrorResponse(error);
      }
    }

    return createLambdaSuccessResponse(await handler(payload));
  };
}
