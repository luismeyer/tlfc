import { z } from "zod";

import { createLambda } from "@tsls/core";

const Request = z.object({
  name: z.string(),
});

const Response = z.object({
  greeting: z.string(),
});

const testHandler = createLambda(
  Request,
  Response,

  async (event) => {
    return { greeting: `Hello ${event.name}` };
  }
);

export default testHandler;
