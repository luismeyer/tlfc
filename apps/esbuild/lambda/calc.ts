import { z } from "zod";

import { createLambda } from "@tlfc/server";

export default createLambda(
  {
    functionName: "calc",
    requestSchema: z.object({ a: z.number(), b: z.number() }),
    responseSchema: z.object({ result: z.number() }),
  },
  async (event) => {
    return {
      result: event.a + event.b,
    };
  }
);
