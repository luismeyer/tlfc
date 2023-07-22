import { Lambda } from "@tlfc/core";

export * from "./dev";
export * from "./build-stack";
export * from "./tools";
export * from "./parse-server-code";

// we don't care about the request and response types here
export type AnyLambda = Lambda<any, any>;
