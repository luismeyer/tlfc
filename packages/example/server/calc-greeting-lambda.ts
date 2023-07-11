import { createLambda } from "@tsls/core";

import { z } from "zod";

import { defineLambdaOptions } from "@tsls/core";

export const calcGreetingOptions = defineLambdaOptions({
  requestSchema: z.object({ name: z.string(), sender: z.string() }),
  responseSchema: z.object({ message: z.string() }),
  functionName: "calcGreetingHandler",
  envVariables: ["SOME_ENV_VAR"],
});

export const calcGreetingHandler = createLambda(
  calcGreetingOptions,
  async (event) => {
    const env = process.env.SOME_ENV_VAR;

    if (!env) {
      throw new Error("Missing env var 'SOME_ENV_VAR'");
    }

    return {
      message: `Hello ${event.name} from ${event.sender} inside ${env}!`,
    };
  }
);

export const handler = calcGreetingHandler.handler;
