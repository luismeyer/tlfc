export const overrideAwsSdk = (id: string, includeAwsSdk?: boolean) => {
  if (!includeAwsSdk && id.includes("@aws-sdk/client-lambda")) {
    // rewrite the imports we use in the create-sdk-call.ts file
    return `
      export const InvokeCommand = null;
      export const LambdaClient = null;
      export default null;
    `;
  }
};
