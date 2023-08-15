import greetingLambda from "./greeting-lambda";

const response = await greetingLambda.call({
  name: "test",
});

console.log(response.msg);
