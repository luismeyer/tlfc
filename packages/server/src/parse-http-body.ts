import { z, ZodObject, ZodRawShape } from "zod";

import { devLog } from "@tlfc/core";

const HttpEvent = z.object({
  body: z.string(),
  isBase64Encoded: z.optional(z.boolean()),
});

export function parseHttpBody<RequestSchema extends ZodObject<ZodRawShape>>(
  event: unknown,
  requestSchema: RequestSchema
): z.TypeOf<RequestSchema> | undefined {
  const eventParseResult = HttpEvent.safeParse(event);

  if (!eventParseResult.success) {
    devLog("Http Event parse error ", eventParseResult.error);
    return;
  }

  let {
    data: { body, isBase64Encoded },
  } = eventParseResult;

  if (isBase64Encoded) {
    const buffer = Buffer.from(body, "base64");
    body = buffer.toString("utf-8");
  }

  const bodyParseResult = requestSchema.safeParse(JSON.parse(body));

  if (!bodyParseResult.success) {
    devLog("Http Body parse error ", bodyParseResult.error);
    return;
  }

  return bodyParseResult.data;
}
