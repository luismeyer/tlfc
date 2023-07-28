import { APIGatewayProxyResult } from "aws-lambda";
import { Application } from "express";

import { getQueryStringParameters } from "./get-query-string-parameters";
import { getRequestHeaders } from "./get-request-headers";
import { invokeLambda } from "./invoke-lambda";
import { LambdaOutput } from "../esbuild";

export function registerApiRoute(app: Application, lambda: LambdaOutput) {
  const path = `/${lambda.definition.functionName}`;

  console.info(`@tlfc: register api route: ${path}`);

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
      console.info("@tlfc: api route error", error);

      response.status(500).send();
    }
  });
}
