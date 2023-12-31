import { EndpointType, SchemaType, OptionalSchemaBase } from "@tlfc/core";

import { EventParseError } from "./event-parse-error";
import { parseHttpBody } from "./parse-http-body";
import { parseHttpQuery } from "./parse-http-query";
import { parseSdkEvent } from "./parse-sdk-event";

export function parseEvent<RequestSchema extends OptionalSchemaBase>(
  event: unknown,
  requestSchema: RequestSchema,
  endpointType: EndpointType
): SchemaType<RequestSchema> {
  const eventParseError = new EventParseError();

  try {
    return parseSdkEvent(event, requestSchema);
  } catch (error) {
    eventParseError.setSdkParseError(error);
  }

  try {
    if (endpointType === "POST") {
      return parseHttpBody(event, requestSchema);
    }
  } catch (error) {
    eventParseError.setBodyParseError(error);
  }

  try {
    if (endpointType === "GET") {
      return parseHttpQuery(event, requestSchema);
    }
  } catch (error) {
    eventParseError.setQueryParseError(error);
  }

  throw eventParseError;
}
