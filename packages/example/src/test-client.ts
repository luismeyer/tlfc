import testHandler from "./test-lambda";

async function main() {
  const response = await testHandler.call({ name: "Luis" });

  console.log({ response });
}

main();
