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

  if (handlerMatcher) {
    const [, handler] = handlerMatcher;

    clienCode = clienCode.replaceAll(
      handler,
      "/** @tlfc: removed lambda handler **/"
    );
  }

  if (LambdaEnvVarsRegex.test(clienCode)) {
    clienCode = clienCode.replace(
      LambdaEnvVarsRegex,
      "/** @tlfc: removed envVars **/"
    );
  }

  return clienCode;
}
