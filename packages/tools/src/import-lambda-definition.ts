import { AnyLambda } from "./any-lambda";

export async function importLambdaDefinition(path: string): Promise<AnyLambda> {
  const module = await import(path);

  return module.default.default;
}
