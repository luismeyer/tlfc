import { createLambda } from "@tsls/core";
import { lambdaOptions } from "./shared";

export const testHandler = createLambda(async (event) => {
  return { greeting: `Hello ${event.name}` };
}, lambdaOptions);

export const handler = testHandler.handler;
