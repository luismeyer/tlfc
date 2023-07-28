export const ServerImportLiteral = "@tlfc/server";
export const ClientImportLiteral = "@tlfc/client";

// matches the second parameter of the createLambda function
const LambdaHandlerRegex = /createLambda\(.*{.*}(,.*)\);/ms;

// matches the envVariables property of the createLambda options
const LambdaEnvVarsRegex = /envVariables(:.*\[.*\])?,?/ms;

export function parseServerCode(serverCode: string) {
  // replace the import literals
  let clienCode = serverCode.replaceAll(
    ServerImportLiteral,
    ClientImportLiteral
  );

  // search for handler code
  const handlerMatcher = LambdaHandlerRegex.exec(clienCode);
  const [, handler] = handlerMatcher ?? [];

  if (handler) {
    const tlfcComment = "/** @tlfc: removed lambda handler **/";
    clienCode = clienCode.replaceAll(handler, tlfcComment);
  }

  // search for env vars
  const hasEnvVars = LambdaEnvVarsRegex.test(clienCode);

  if (hasEnvVars) {
    const tlfcComment = "/** @tlfc: removed envVars **/";
    clienCode = clienCode.replace(LambdaEnvVarsRegex, tlfcComment);
  }

  return clienCode;
}
