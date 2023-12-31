import { APIGatewayProxyResult } from "aws-lambda";

const responseHeaders = {
  "Access-Control-Allow-Origin": `*`,
  "Access-Control-Allow-Credentials": `true`,
  "Access-Control-Expose-Headers": `*`,
  "content-type": `application/json`,
};

export function createLambdaSuccessResponse(
  data: unknown
): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: responseHeaders,
  };
}

export function createLambdaErrorResponse(
  error: unknown
): APIGatewayProxyResult {
  return {
    statusCode: 500,
    body: JSON.stringify(error),
    headers: responseHeaders,
  };
}
