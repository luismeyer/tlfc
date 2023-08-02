import { buildStack } from "./build-stack";
import { dev } from "./dev";

type Tools = {
  buildStack: () => ReturnType<typeof buildStack>;
  dev: () => Promise<() => Promise<void>>;
};

export function tools(...lambdaEntries: string[]): Tools {
  const options = { lambdaEntries };

  return {
    buildStack: () => buildStack(options),
    dev: () => dev(options),
  };
}
