import { APIGatewayProxyResult } from "aws-lambda";
import { Application } from "express";
import { ZodObject, ZodRawShape } from "zod";

import { AnyLambda } from "../";
import { getQueryStringParameters } from "./get-query-string-parameters";
import { getRequestHeaders } from "./get-request-headers";
import { invokeLambda } from "./invoke-lambda";

export function registerApiRoute<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
>(app: Application, lambda: AnyLambda) {
  const path = `/${lambda.functionName}`;

  console.info(`tlfc: Register api route: ${path}`);

  app.all(path, async (request, response) => {
    try {
      const result = (await invokeLambda(lambda, {
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
        body: JSON.stringify(request.body),
        isBase64Encoded: false,
      })) as APIGatewayProxyResult;

      response
        .type("json")
        .status(result.statusCode)
        .header(result.headers)
        .send(result.body);
    } catch (error) {
      console.info("tlfc: Api route error", error);

      response.status(500).send();
    }
  });
}
