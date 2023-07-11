import { createLambdaCall, configure } from "@tsls/core";

import { greetingOptions } from "../server/greeting-lambda";

configure(import.meta.env.VITE_TSLS_API_PATH);

const button = document.getElementById("button")!;
const title = document.getElementById("title")!;

async function handleClick() {
  const call = createLambdaCall(greetingOptions);

  const response = await call({ name: "test" });

  title.innerText = response.message;
}

button.addEventListener("click", handleClick);
