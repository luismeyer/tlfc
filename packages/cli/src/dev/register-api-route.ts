import { APIGatewayProxyResult } from "aws-lambda";
import { Application } from "express";
import { ZodObject, ZodRawShape } from "zod";

import { Lambda } from "@tsls/core";

import { createRunLambda } from "./create-run-lambda";
import { getQueryStringParameters } from "./get-query-string-parameters";
import { getRequestHeaders } from "./get-request-headers";

export function registerApiRoute<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(app: Application, option: Lambda<RequestSchema, ResponseSchema>) {
  const path = `/${option.functionName}`;

  console.info(`register api route: ${path}`);

  app.all(path, async (request, response) => {
    const lambda = createRunLambda(option);

    try {
      const result = await lambda.execute<APIGatewayProxyResult>({
        ...getQueryStringParameters(request),
        ...getRequestHeaders(request),
        requestContext: {
          protocol: request.protocol,
          httpMethod: request.method,
          path: request.path,
          resourcePath: request.path,
        },
        path: request.path,
        httpMethod: request.method,
        body: Buffer.from(JSON.stringify(request.body)).toString(`base64`),
        isBase64Encoded: false,
      });

      response
        .type("json")
        .status(result.statusCode)
        .header(result.headers)
        .send(result.body);
    } catch (error) {
      console.info("Api route error", error);

      response.status(500).send();
    }
  });
}
