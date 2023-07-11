import { buildStack } from "@tsls/utils";

import { testHandler } from "../lib/lambda.js";

buildStack([testHandler]);
