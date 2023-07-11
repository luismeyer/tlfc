import { createLambda, createLambdaCall } from "@tsls/core";

import { z } from "zod";

import { defineLambdaOptions } from "@tsls/core";
import { calcGreetingOptions } from "./calc-greeting-lambda";

export const greetingOptions = defineLambdaOptions({
  requestSchema: z.object({ name: z.string() }),
  responseSchema: z.object({ message: z.string() }),
  functionName: "greetingHandler",
  endpointType: "GET",
});

export const greetingHandler = createLambda(greetingOptions, async (event) => {
  const calcGreetingHandler = createLambdaCall(calcGreetingOptions);

  const { message } = await calcGreetingHandler({
    name: event.name,
    sender: "greetingHandler",
  });

  return { message };
});

export const handler = greetingHandler.handler;
