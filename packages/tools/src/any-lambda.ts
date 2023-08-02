import { Lambda } from "@tlfc/core";

// we don't care about the request and response types here
export type AnyLambda = Lambda<any, any>;
