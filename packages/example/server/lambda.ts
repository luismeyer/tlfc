import { createLambda } from "@tsls/core";
import { lambdaOptions } from "./shared";

export const testHandler = createLambda(lambdaOptions, async (event) => {
  return { greeting: `Hello ${event.name}` };
});

export const handler = testHandler.handler;
