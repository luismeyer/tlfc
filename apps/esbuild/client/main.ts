import calcLambda from "../lambda/calc";

const button = document.getElementById("button");
const response = document.getElementById("response");

if (!button) {
  throw new Error("Button not found");
}

if (!response) {
  throw new Error("Response not found");
}

button.addEventListener("click", async () => {
  const { result } = await calcLambda.call({ a: 1, b: 2 });

  response.innerHTML = `${result}`;
});
