import { z, ZodObject, ZodRawShape } from "zod";

import type { APIGatewayProxyHandler } from "aws-lambda";

export type EndpointType = "GET" | "POST";

export type RequiredSchemaBase = ZodObject<ZodRawShape>;

export type UndefinedSchemaBase = ZodObject<{}>;

export type OptionalSchemaBase = RequiredSchemaBase | UndefinedSchemaBase;

export type LambdaOptions<
  RequestSchema extends OptionalSchemaBase,
  ResponseSchema extends RequiredSchemaBase
> = {
  requestSchema?: RequestSchema;
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
  /**
   * Hide the lambda from the HTTP API Gateway.
   * The lambda can only be invoked from a Node environment with the aws-sdk.
   */
  httpDisabled?: boolean;
};

export type Lambda<
  RequestSchema extends OptionalSchemaBase,
  ResponseSchema extends RequiredSchemaBase
> = {
  // client side code
  call: LambdaFunction<RequestSchema, ResponseSchema>;

  // the functionName identifies the location where the lambda can be invoked
  functionName: string;

  // server side code
  handler: APIGatewayProxyHandler;

  endpointType: EndpointType;
  envVariables: string[];
  httpDisabled: boolean;
};

export type SchemaType<Schema extends OptionalSchemaBase> = z.infer<Schema>;

export type LambdaFunction<
  RequestSchema extends OptionalSchemaBase,
  ResponseSchema extends RequiredSchemaBase
> = (request: SchemaType<RequestSchema>) => Promise<z.infer<ResponseSchema>>;
