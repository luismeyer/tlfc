import {
  devLog,
  EndpointType,
  LambdaFunction,
  readConfig,
  SchemaType,
  OptionalSchemaBase,
  RequiredSchemaBase,
} from "@tlfc/core";

function createUrl<RequestSchema extends OptionalSchemaBase>(
  functionName: string,
  request: SchemaType<RequestSchema>,
  endpointType: EndpointType
): string {
  const { api } = readConfig();
  const url = new URL(functionName, api.endpoint);

  if (endpointType === "GET") {
    const params = new URLSearchParams(request).toString();

    if (params.length) {
      return `${url}?${params}`;
    }
  }

  return url.toString();
}

function createBody<RequestSchema extends OptionalSchemaBase>(
  request: SchemaType<RequestSchema>,
  endpointType: EndpointType
): string | undefined {
  if (endpointType !== "POST") {
    return;
  }

  return JSON.stringify(request);
}

export function createFetchCall<
  RequestSchema extends OptionalSchemaBase,
  ResponseSchema extends RequiredSchemaBase
>(
  responseSchema: ResponseSchema,
  functionName: string,
  endpointType: EndpointType
): LambdaFunction<RequestSchema, ResponseSchema> {
  devLog(`Creating call with Fetch for ${functionName}`);

  return async function (request) {
    devLog(`Fetch invoking lambda`);

    const url = createUrl(functionName, request, endpointType);

    const result = await fetch(url, {
      method: endpointType,
      body: createBody(request, endpointType),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await result.json();

    if (!result.ok) {
      throw new Error(JSON.stringify(response, null, 2));
    }

    return responseSchema.parse(response);
  };
}
