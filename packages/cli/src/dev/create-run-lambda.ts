import { Lambda as RunLambda, LambdaMode } from "runl";

import { Lambda } from "@tsls/core";
import { ZodObject, ZodRawShape } from "zod";

export function createRunLambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(options: Lambda<RequestSchema, ResponseSchema>) {
  const { filename } = options;

  return new RunLambda({
    mode: LambdaMode.Persistent,
    lambdaPath: filename,
    lambdaHandler: "handler",
    autoReload: true,
    environment: {
      IS_LOCAL: "true",
    },
  });
}
