import { z } from "zod";

import { createLambda } from "@tlfc/server";

export default createLambda(
  {
    functionName: "calc",
    responseSchema: z.object({ result: z.number() }),
  },
  async () => {
    return {
      result: 1,
    };
  }
);
