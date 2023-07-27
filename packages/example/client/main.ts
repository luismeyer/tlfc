import { configure } from "@tlfc/client";

import greetingLambda from "../server/greeting-lambda";

configure(import.meta.env.VITE_TLFC_API_PATH);

const button = document.getElementById("button")!;
const title = document.getElementById("title")!;

async function handleClick() {
  const response = await greetingLambda.call({ name: "test", disabled: false });

  title.innerText = response.message;
}

button.addEventListener("click", handleClick);
