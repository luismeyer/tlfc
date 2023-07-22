import esbuild from "esbuild";
import { join } from "path";

import { AnyLambda } from "./";
import { handlerFileName } from "./create-lambda-function";
import { EsbuildPlugin } from "./esbuild-plugin";

export const outdir = join(process.cwd(), "dist");

export function lambdaUploadDir(lambda: AnyLambda) {
  return join(outdir, lambda.functionName);
}

export function lambdaBundleFile(lambda: AnyLambda) {
  const bundleFilename = `${handlerFileName}.js`;
  const uploadDir = lambdaUploadDir(lambda);

  return join(uploadDir, bundleFilename);
}

function createBuildOptions(lambda: AnyLambda): esbuild.BuildOptions {
  return {
    entryPoints: [lambda.fullFilePath],
    outfile: lambdaBundleFile(lambda),
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    logLevel: "info",
    treeShaking: true,
    plugins: [EsbuildPlugin],
  };
}

export async function build(lambdas: AnyLambda[]) {
  const promises = lambdas.map(async (lambda) => {
    // seperately build each lambda so we can be sure about the entry file
    const options = createBuildOptions(lambda);
    await esbuild.build(options);
  });

  await Promise.all(promises);
}

export async function buildWatch(lambdas: AnyLambda[]) {
  const promises = lambdas.map(async (lambda) => {
    const options = createBuildOptions(lambda);
    const context = await esbuild.context(options);

    await context.watch();
  });

  await Promise.all(promises);
}
