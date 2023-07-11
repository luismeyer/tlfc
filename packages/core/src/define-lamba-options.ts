import { ZodObject, ZodRawShape } from "zod";

export type EndpointType = "GET" | "POST";

export type LambdaOptions<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = {
  requestSchema: RequestSchema;
  responseSchema: ResponseSchema;
  functionName: string;
  /**
   * Determine the HTTP method used to invoke the lambda.
   * If set to 'GET' the lambda input will be parsed from the query params.
   * If endpointType is not set, the lambda will not be exposed via HTTP.
   */
  endpointType?: EndpointType;
};

export function defineLambdaOptions<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>
): LambdaOptions<RequestSchema, ResponseSchema> {
  return options;
}
