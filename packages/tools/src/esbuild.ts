import esbuild from "esbuild";
import path from "path";
import fs from "fs";

import { handlerFileName } from "./create-lambda-function";
import { EsbuildPlugin } from "./esbuild-plugin";
import { AnyLambda } from ".";

export type LambdaOutput = {
  entry: string;
  bundleFile: string;
  uploadDir: string;
  definition: AnyLambda;
};

export const DistDirName = "dist";

export const outdir = path.join(process.cwd(), DistDirName);

function lambdaOutput(lambdaEntry: string) {
  const bundleFilename = `${handlerFileName}.js`;
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
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    logLevel: "error",
    treeShaking: true,
    plugins: [EsbuildPlugin],
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

    console.info(`@tlfc: building lambda: '${entry}'`);

    // seperately build each lambda so we can be sure about the entry file
    const options = createBuildOptions(entry, bundleFile);
    await esbuild.build(options);

    const module = await import(bundleFile);

    return {
      entry,
      bundleFile,
      uploadDir,
      definition: module.default,
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

    console.info(`@tlfc: watching lambda: '${entry}'`);

    await context.watch();

    const module = await import(bundleFile);

    return {
      entry,
      bundleFile,
      uploadDir,
      definition: module.default,
    };
  });

  return Promise.all(promises);
}
