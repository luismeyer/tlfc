import { tools } from "@tlfc/tools";

import envLambda from "../server/env-lambda";
import calcGreetingLambda from "../server/calc-greeting-lambda";
import greetingLambda from "../server/greeting-lambda";

export const { buildStack, dev } = tools(
  calcGreetingLambda,
  greetingLambda,
  envLambda
);
