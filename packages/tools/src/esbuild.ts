import esbuild from "esbuild";
import fs from "fs";
import path from "path";

import { AnyLambda } from "./any-lambda";
import { handlerFileName } from "./create-lambda-function";
import { log } from "./dev/log";
import { esbuildPluginTlfc } from "./esbuild-plugin";
import { importLambdaDefinition } from "./import-lambda-definition";

export type LambdaOutput = {
  entry: string;
  bundleFile: string;
  uploadDir: string;
  definition: AnyLambda;
};

export const DistDirName = ".tlfc";

export const outdir = path.join(process.cwd(), DistDirName);

function lambdaOutput(lambdaEntry: string) {
  const bundleFilename = `${handlerFileName}.cjs`;
  const uploadDir = path.join(outdir, path.basename(lambdaEntry));

  return { uploadDir, bundleFile: path.join(uploadDir, bundleFilename) };
}

function createBuildOptions(
  entry: string,
  outfile: string
): esbuild.BuildOptions {
  return {
    entryPoints: [entry],
    outfile,
    external: ["@aws-sdk/client-lambda"],
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    logLevel: "error",
    treeShaking: true,
    plugins: [esbuildPluginTlfc({ ignoreEntry: true, includeAwsSdk: true })],
  };
}

function validateEntry(entry: string) {
  if (!entry.trim().length) {
    throw new Error("@tlfc Error: Received empty string as entry file.");
  }

  if (!fs.existsSync(entry)) {
    throw new Error(`@tlfc Error: Entry file '${entry}' does not exist.`);
  }
}

export async function build(entries: string[]): Promise<LambdaOutput[]> {
  const promises = entries.map(async (entry) => {
    validateEntry(entry);

    const { uploadDir, bundleFile } = lambdaOutput(entry);

    log(`building lambda: '${entry}'`);

    // seperately build each lambda so we can be sure about the entry file
    const options = createBuildOptions(entry, bundleFile);
    await esbuild.build(options);

    const definition = await importLambdaDefinition(bundleFile);

    return {
      entry,
      bundleFile,
      uploadDir,
      definition,
    };
  });

  return Promise.all(promises);
}

export async function buildWatch(entries: string[]): Promise<LambdaOutput[]> {
  const promises = entries.map(async (entry) => {
    validateEntry(entry);

    const { uploadDir, bundleFile } = lambdaOutput(entry);

    const options = createBuildOptions(entry, bundleFile);
    const context = await esbuild.context(options);

    log(`watching lambda: '${entry}'`);

    // inital build
    await esbuild.build(options);

    const definition = await importLambdaDefinition(bundleFile);

    // start watch
    await context.watch();

    return {
      entry,
      bundleFile,
      uploadDir,
      definition,
    };
  });

  return Promise.all(promises);
}
