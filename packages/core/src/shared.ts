import { ZodObject, ZodRawShape } from "zod";

export type LambdaOptions<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = {
  requestSchema: RequestSchema;
  responseSchema: ResponseSchema;
  functionName: string;
};

export function createLambdaOptions<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  requestSchema: RequestSchema,
  responseSchema: ResponseSchema,
  functionName: string
) {
  return {
    requestSchema,
    responseSchema,
    functionName,
  };
}
