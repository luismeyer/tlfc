import { z } from "zod";

import { createLambda } from "@tlfc/server";

export default createLambda(
  {
    requestSchema: z.object({ name: z.string() }),
    responseSchema: z.object({ msg: z.string() }),
    functionName: "greetingHandler",
  },
  async (event) => {
    return {
      msg: `Hello ${event.name}`,
    };
  }
);
