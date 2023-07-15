import { z } from "zod";

import { defineLambdaOptions } from "@tlfc/core";

export const lambdaOptions = defineLambdaOptions({
  requestSchema: z.object({ name: z.string() }),
  responseSchema: z.object({ greeting: z.string() }),
  functionName: "testHandler",
  endpointType: "GET",
});
