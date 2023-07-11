import { createLambda } from "@tsls/core";

import { z } from "zod";

import { defineLambdaOptions } from "@tsls/core";

export const calcGreetingOptions = defineLambdaOptions({
  requestSchema: z.object({ name: z.string(), sender: z.string() }),
  responseSchema: z.object({ message: z.string() }),
  functionName: "calcGreetingHandler",
});

export const calcGreetingHandler = createLambda(
  calcGreetingOptions,
  async (event) => {
    return {
      message: `Hello ${event.name} from ${event.sender}`,
    };
  }
);

export const handler = calcGreetingHandler.handler;
