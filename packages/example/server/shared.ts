import { z } from "zod";

import { createLambdaOptions } from "@tsls/core";

const requestSchema = z.object({ name: z.string() });

const responseSchema = z.object({ greeting: z.string() });

export const lambdaOptions = createLambdaOptions(
  requestSchema,
  responseSchema,
  "testHandler"
);
