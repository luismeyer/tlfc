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
  version?: string;
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
  .option("-v, --version <string>", "specify stack version")
  .action(async ({ entries, version }: CommandOptions) => {
    await buildStack({ lambdaEntries: entries, version });
  });

program
  .command("deploy")
  .description("Deploying cdk stack.")
  .option("-e, --entries [files...]", "specify entry files")
  .option("-v, --version <string>", "specify stack version")
  .action(({ entries, version }: CommandOptions) => {
    const versionFlag = version ? `-v ${version}` : "";
    const entriesFlag = entries?.map((entry) => `-e ${entry}`).join(" ") ?? "";

    const buildCommand = `tlfc ${BuildStackCommand} ${versionFlag} ${entriesFlag}`;

    const child = exec(
      `cdk deploy --require-approval 'never' --app '${buildCommand}'`
    );

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
  });

program.parse();
