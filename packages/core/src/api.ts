import { z, ZodObject, ZodRawShape } from "zod";

import type { APIGatewayProxyHandler } from "aws-lambda";

export type EndpointType = "GET" | "POST";

export type LambdaOptions<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = {
  requestSchema: RequestSchema;
  responseSchema: ResponseSchema;
  /**
   * Unique identifier of the lambda. This has to be unique across your AWS account.
   * This will be used as the Gateway Path and as the lambda name in AWS.
   */
  functionName: string;
  /**
   * Determine the HTTP method used to invoke the lambda.
   * If set to 'GET' the lambda input will be parsed from the query params.
   * If endpointType is not set, the lambda will not be exposed via HTTP.
   */
  endpointType?: EndpointType;
  /**
   * Environment Variables that will be loaded from 'process.env'
   * into the lambda environment during the deployment
   */
  envVariables?: string[];
};

export type Lambda<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = {
  // the functionName identifies the location where the lambda can be invoked
  functionName: string;

  // server side code
  handler: APIGatewayProxyHandler;

  // client side code
  call: LambdaCall<RequestSchema, ResponseSchema>;

  // used to finde the entry for the deployment
  fullFilePath: string;
  endpointType?: EndpointType;
  envVariables: string[];
};

type LambdaFunction<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = (request: z.infer<RequestSchema>) => Promise<z.infer<ResponseSchema>>;

export type LambdaCall<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = LambdaFunction<RequestSchema, ResponseSchema>;

export type LambdaHandler<
  RequestSchema extends ZodObject<ZodRawShape>,
  ResponseSchema extends ZodObject<ZodRawShape>
> = LambdaFunction<RequestSchema, ResponseSchema>;
