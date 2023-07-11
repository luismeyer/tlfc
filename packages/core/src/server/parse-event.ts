import { z, ZodObject, ZodRawShape } from "zod";

import { parseHttpBody } from "./parse-http-body";
import { parseHttpQuery } from "./parse-http-query";
import { parseSdkEvent } from "./parse-sdk-event";

export function parseEvent<RequestSchema extends ZodObject<ZodRawShape>>(
  event: unknown,
  requestSchema: RequestSchema
): z.TypeOf<RequestSchema> | undefined {
  const httpBody = parseHttpBody(event, requestSchema);
  if (httpBody) {
    return httpBody;
  }

  const sdkEvent = parseSdkEvent(event, requestSchema);
  if (sdkEvent) {
    return sdkEvent;
  }

  const httpQuery = parseHttpQuery(event, requestSchema);
  if (httpQuery) {
    return httpQuery;
  }
}
