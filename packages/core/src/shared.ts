import { ZodObject, ZodRawShape } from "zod";

export type LambdaOptions<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = {
  requestSchema: RequestSchema;
  responseSchema: ResponseSchema;
  functionName: string;
};

export function defineLambdaOptions<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(
  options: LambdaOptions<RequestSchema, ResponseSchema>
): LambdaOptions<RequestSchema, ResponseSchema> {
  return options;
}
