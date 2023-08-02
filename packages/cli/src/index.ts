#! /usr/bin/env node
import { Command } from "commander";

import { exec } from "child_process";

import { buildStack, dev } from "@tlfc/tools";

const program = new Command();

program
  .name("@tlfc")
  .description("Cli to interact with the @tlfc tools")
  .version("1.0.0");

type CommandOptions = {
  entries?: string[];
};

program
  .command("dev")
  .description("Run local lambda dev server.")
  .option("-e, --entries [files...]", "specify entry files")
  .action(async ({ entries }: CommandOptions) => {
    await dev({ lambdaEntries: entries });
  });

const BuildStackCommand = "buildStack";

program
  .command(BuildStackCommand)
  .description("Build cdk stack.")
  .option("-e, --entries [files...]", "specify entry files")
  .action(async ({ entries }: CommandOptions) => {
    await buildStack({ lambdaEntries: entries });
  });

program
  .command("deploy")
  .description("Deploying cdk stack.")
  .action(() => {
    const child = exec(
      `cdk deploy --require-approval 'never' --app 'tlfc ${BuildStackCommand}'`
    );

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });

program.parse();
