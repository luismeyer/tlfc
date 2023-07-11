import { createLambdaCall } from "@tsls/core";

import { lambdaOptions } from "../lib/shared.js";

export const call = createLambdaCall(lambdaOptions);

const result = await call({ name: "test" });

console.log(result);
