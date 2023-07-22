import { z, ZodObject, ZodRawShape } from "zod";

import { devLog } from "@tlfc/core";

export function parseSdkEvent<RequestSchema extends ZodObject<ZodRawShape>>(
  event: unknown,
  requestSchema: RequestSchema
): z.TypeOf<RequestSchema> | undefined {
  const parseResult = requestSchema.safeParse(event);

  if (!parseResult.success) {
    devLog("SDK Event parse error ", parseResult.error);
    return;
  }

  return parseResult.data;
}
