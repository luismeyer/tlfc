import { AnyLambda } from "./";
import { buildStack } from "./build-stack";
import { dev } from "./dev";

type Tools = {
  buildStack: () => ReturnType<typeof buildStack>;
  dev: () => Promise<void>;
};

export function tools(...lambdas: AnyLambda[]): Tools {
  return {
    buildStack: () => buildStack(lambdas),
    dev: () => dev(lambdas),
  };
}
