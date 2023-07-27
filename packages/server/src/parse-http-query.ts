import { z, ZodObject, ZodRawShape } from "zod";

import { devLog } from "@tlfc/core";

const HttpGetEvent = z.object({
  queryStringParameters: z.record(z.string()),
});

function preParseQuery(
  query: Record<string, string>
): undefined | Record<string, string | number | boolean> {
  let result: Record<string, string | number | boolean> = {};

  Object.entries(query).forEach(([key, value]) => {
    const number = parseInt(value);
    if (!isNaN(number)) {
      result[key] = number;
      return;
    }

    if (value === "true" || value === "false") {
      result[key] = value === "true";
      return;
    }

    result[key] = value;
  });

  return result;
}

export function parseHttpQuery<RequestSchema extends ZodObject<ZodRawShape>>(
  event: unknown,
  requestSchema: RequestSchema
): z.TypeOf<RequestSchema> | undefined {
  const eventParseResult = HttpGetEvent.safeParse(event);

  if (!eventParseResult.success) {
    devLog("Http Query event parse error ", eventParseResult.error);
    return;
  }

  const query = preParseQuery(eventParseResult.data.queryStringParameters);

  const queryParseResult = requestSchema.safeParse(query);

  if (!queryParseResult.success) {
    devLog("Http Query parse error ", queryParseResult.error);
    return;
  }

  return queryParseResult.data;
}
