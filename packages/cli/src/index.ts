#! /usr/bin/env node
import { Command } from "commander";

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
    await dev(entries);
  });

program
  .command("build")
  .description("Build cdk stack.")
  .option("-e, --entries [files...]", "specify entry files")
  .action(async ({ entries }: CommandOptions) => {
    await buildStack(entries);
  });

program.parse();
