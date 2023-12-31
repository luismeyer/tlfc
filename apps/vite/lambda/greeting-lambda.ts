import { z } from "zod";

import { createLambda } from "@tlfc/server";

export default createLambda(
  {
    requestSchema: z.object({ name: z.string() }),
    responseSchema: z.object({ message: z.string() }),
    functionName: "greetingHandler",
  },
  async (event) => {
    return {
      message: `Hello ${event.name}`,
    };
  }
);
