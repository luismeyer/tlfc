import { createLambdaCall } from "@tsls/core";
import { lambdaOptions } from "./shared";

const button = document.getElementById("button")!;
const title = document.getElementById("title")!;

async function handleClick() {
  const call = createLambdaCall(lambdaOptions);

  const response = await call({ name: "luis" });

  title.innerText = response.greeting;
}

button.addEventListener("click", handleClick);
