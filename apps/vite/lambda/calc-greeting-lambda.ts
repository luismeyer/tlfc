import { z } from "zod";

import { createLambda } from "@tlfc/server";

import envLambda from "./env-lambda";

export default createLambda(
  {
    requestSchema: z.object({ name: z.string(), sender: z.string() }),
    responseSchema: z.object({ message: z.string() }),
    functionName: "calcGreetingHandler",
    envVariables: ["SOME_ENV_VAR"],
  },
  async (event) => {
    const { env } = await envLambda.call({ name: "admin" });

    return {
      message: `Moin, ${event.name}. This is the ${event.sender}. I'm running inside ${env}!`,
    };
  }
);
