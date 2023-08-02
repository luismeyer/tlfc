export const DEFAULT_VERSION = "default";

export function createLambdaFunctionName(
  functionName: string,
  version: string = DEFAULT_VERSION
) {
  return `${functionName}-${version}`;
}
