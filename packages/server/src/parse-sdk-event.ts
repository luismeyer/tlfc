import { z, ZodObject, ZodRawShape } from "zod";
import { ParseError } from "./event-parse-error";

export function parseSdkEvent<RequestSchema extends ZodObject<ZodRawShape>>(
  event: unknown,
  requestSchema: RequestSchema
): z.TypeOf<RequestSchema> {
  const result = requestSchema.safeParse(event);

  if (!result.success) {
    throw new ParseError(result.error.issues);
  }

  return result.data;
}
