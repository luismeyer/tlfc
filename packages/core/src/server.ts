import { APIGatewayEvent } from "aws-lambda";
import { z, ZodObject, ZodRawShape } from "zod";
import { LambdaOptions } from "./shared";

export type LambdaHandler = (event: APIGatewayEvent | unknown) => unknown;

function createLambdaSuccessResponse(data: unknown) {
  return { statusCode: 200, body: JSON.stringify(data) };
}

function createLambdaErrorResponse(error: unknown) {
  return { statusCode: 500, body: JSON.stringify(error) };
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
  console.info("Creating lambda Wrapper for ", functionName);

  return async function (event) {
    console.info("Running lambda ", functionName);

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
        console.info("Lambda Execution Error", error);

        return createLambdaErrorResponse(error);
      }
    }

    return createLambdaSuccessResponse(await handler(payload));
  };
}
