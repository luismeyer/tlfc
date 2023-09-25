export const ServerImportLiteral = "@tlfc/server";
export const ClientImportLiteral = "@tlfc/client";

// matches the second parameter of the createLambda function
const LambdaHandlerRegex = /createLambda\(.*{.*}(,.*)\);/ms;

// matches the envVariables property of the createLambda options
const LambdaEnvVarsRegex = /envVariables(:.*\[.*\])?,?/ms;

export function parseServerCode(serverCode: string) {
  // replace all server code
  const hasServerImport = serverCode.includes(ServerImportLiteral);
  if (!hasServerImport) {
    return;
  }

  // replace the import literals
  let clientCode = serverCode.replaceAll(
    ServerImportLiteral,
    ClientImportLiteral
  );

  // search for handler code
  const handlerMatcher = LambdaHandlerRegex.exec(clientCode);
  const [, handler] = handlerMatcher ?? [];

  if (handler) {
    const tlfcComment = "/** @tlfc: removed lambda handler **/";
    clientCode = clientCode.replaceAll(handler, tlfcComment);
  }

  // search for env vars
  const hasEnvVars = LambdaEnvVarsRegex.test(clientCode);

  if (hasEnvVars) {
    const tlfcComment = "/** @tlfc: removed envVars **/";
    clientCode = clientCode.replace(LambdaEnvVarsRegex, tlfcComment);
  }

  return clientCode;
}
