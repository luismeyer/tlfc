import { z } from "zod";

import { SchemaType, OptionalSchemaBase } from "@tlfc/core";

import { ParseError } from "./event-parse-error";

const HttpEvent = z.object({
  body: z.string(),
  isBase64Encoded: z.optional(z.boolean()),
});

export function parseHttpBody<RequestSchema extends OptionalSchemaBase>(
  event: unknown,
  requestSchema: RequestSchema
): SchemaType<RequestSchema> {
  const eventParseResult = HttpEvent.parse(event);

  let { body, isBase64Encoded } = eventParseResult;

  if (isBase64Encoded) {
    const buffer = Buffer.from(body, "base64");
    body = buffer.toString("utf-8");
  }

  const result = requestSchema.safeParse(JSON.parse(body));
  if (!result.success) {
    throw new ParseError(result.error.issues);
  }

  return result.data;
}
