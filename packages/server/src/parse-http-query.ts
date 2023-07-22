import { z, ZodObject, ZodRawShape } from "zod";

import { devLog } from "@tlfc/core";

const HttpGetEvent = z.object({
  queryStringParameters: z.unknown(),
});

export function parseHttpQuery<RequestSchema extends ZodObject<ZodRawShape>>(
  event: unknown,
  requestSchema: RequestSchema
): z.TypeOf<RequestSchema> | undefined {
  const eventParseResult = HttpGetEvent.safeParse(event);

  if (!eventParseResult.success) {
    devLog("Http Query event parse error ", eventParseResult.error);
    return;
  }

  const queryParseResult = requestSchema.safeParse(
    eventParseResult.data.queryStringParameters
  );

  if (!queryParseResult.success) {
    devLog("Http Query parse error ", queryParseResult.error);
    return;
  }

  return queryParseResult.data;
}
