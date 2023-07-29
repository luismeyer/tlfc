import { z } from "zod";

import { createLambda } from "@tlfc/server";

export default createLambda(
  {
    requestSchema: z.object({ name: z.string() }),
    responseSchema: z.object({ env: z.string() }),
    functionName: "envLambda",
    envVariables: ["SOME_ENV_VAR"],
  },
  async (event) => {
    const env = process.env.SOME_ENV_VAR;

    if (event.name !== "admin") {
      return {
        env: `not allowed to access env`,
      };
    }

    if (!env) {
      throw new Error("Missing env var 'SOME_ENV_VAR'");
    }

    return {
      env: `env: ${env}`,
    };
  }
);
