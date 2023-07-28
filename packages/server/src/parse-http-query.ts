import { z, ZodObject, ZodRawShape } from "zod";
import { ParseError } from "./event-parse-error";

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
): z.TypeOf<RequestSchema> {
  const eventParseResult = HttpGetEvent.parse(event);

  const query = preParseQuery(eventParseResult.queryStringParameters);

  const result = requestSchema.safeParse(query);

  if (!result.success) {
    throw new ParseError(result.error.issues);
  }

  return result.data;
}
