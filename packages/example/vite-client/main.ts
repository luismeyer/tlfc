import { createLambdaCall, configure } from "@tsls/core";

import { lambdaOptions } from "../server/shared";

configure(import.meta.env.VITE_TSLS_API_PATH);

const button = document.getElementById("button")!;
const title = document.getElementById("title")!;

async function handleClick() {
  const call = createLambdaCall(lambdaOptions);

  const response = await call({ name: "test" });

  title.innerText = response.greeting;
}

button.addEventListener("click", handleClick);
