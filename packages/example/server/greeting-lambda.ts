import { z } from "zod";

import { createLambda } from "@tlfc/server";

import calcGreetingLambda from "./calc-greeting-lambda";

export default createLambda(
  {
    requestSchema: z.object({ name: z.string() }),
    responseSchema: z.object({ message: z.string() }),
    functionName: "greetingHandler",
  },
  async (event) => {
    const { message } = await calcGreetingLambda.call({
      name: event.name,
      sender: "greetingHandler",
    });

    return { message };
  }
);
