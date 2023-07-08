import testHandler from "./test-server";

async function main() {
  const response = await testHandler.call(
    { name: "Luis" },
    { forceFetch: true }
  );

  console.log({ response });
}

main();
