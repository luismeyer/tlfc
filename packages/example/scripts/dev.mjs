import { dev } from "@tsls/utils";

import { testHandler } from "../lib/lambda.js";

await dev([testHandler]);
