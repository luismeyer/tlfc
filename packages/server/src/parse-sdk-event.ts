import { SchemaType, OptionalSchemaBase } from "@tlfc/core";

import { ParseError } from "./event-parse-error";

export function parseSdkEvent<RequestSchema extends OptionalSchemaBase>(
  event: unknown,
  requestSchema: RequestSchema
): SchemaType<RequestSchema> {
  const result = requestSchema.safeParse(event);

  if (!result.success) {
    throw new ParseError(result.error.issues);
  }

  return result.data;
}
