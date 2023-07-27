<div align="center">
    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vhXCF3elDEQt9g6YZraEEQ.png"/>
</div>

<br />

# @tlfc

Write typesafe AWS lambda functions with:

- ⚙️ minimal configuration effort
- 🏗️ local dev environment
- 🚀 quick deployments
- 🔒 request and response validation
- ⭐️ aws-sdk or fetch for either Browser or Node.js clients
- 😷 typesafe client and server interface

## How it works

### A working example can be found in the [example package](./packages/example/readme.md)

### Simple lambda definition and implementation

```ts
import { z } from "zod";

import { createLambda } from "@tlfc/server";

export default createLambda(
  {
    requestSchema: z.object({ name: z.string() }),
    responseSchema: z.object({ message: z.string() }),
    functionName: "messageHandler",
  },
  async (event) => {
    const message = calculateMessage(event.name);
    return { message };
  }
);
```

### Usage of the lambda in vite client

```ts
import { configure } from "@tlfc/client";

import messageLambda from "../server/message-lambda";

configure(import.meta.env.VITE_TLFC_API_PATH);

async function handleClick() {
  const response = await messageLambda.call({ name: "Foo" });
  title.innerText = response.message;
}
```

Under the hood the `@tlfc/vite` plugin transforms the `@tlfc/server` import to a `@tlfc/client` import. Also it strips the lambda implementation and environment Variables from the client bundle.

The `@tlfc/client` package uses the fetch api to call the lambda at a specific endpoint. For local development the endpoint is automatically resolved. For production the `VITE_TLFC_API_PATH` needs to be set to the URL that the `@tlfc/tools` deployment creates.

If the `@tlfc/client` is used outside the browser it will automatically switch to the `aws-sdk` to call the lambda.
