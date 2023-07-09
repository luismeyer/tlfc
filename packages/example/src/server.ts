import { createLambda } from "@tsls/core";
import { lambdaOptions } from "./shared";

const testHandler = createLambda(async (event) => {
  return { greeting: `Hello ${event.name}` };
}, lambdaOptions);

export default testHandler;
