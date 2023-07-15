import { BuildOptions, buildSync } from "esbuild";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { basename, extname, join } from "path";

import { Lambda } from "@tlfc/core";
import { handlerFileName } from "./create-lambda-function";

export const outdir = join(process.cwd(), "dist");

function lambdaDistFile(lambda: Lambda) {
  const filename = basename(lambda.fullFilePath);

  return join(outdir, filename.replace(extname(filename), ".js"));
}

export function lambdaUploadDir(lambda: Lambda) {
  return join(outdir, lambda.functionName);
}

function createBuildOptions(lambdas: Lambda[]): BuildOptions {
  return {
    entryPoints: lambdas.map(({ fullFilePath }) => fullFilePath),
    outdir,
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    logLevel: "info",
  };
}

export function build(lambdas: Lambda[]) {
  const options = createBuildOptions(lambdas);

  buildSync(options);

  // move the bundled file into seperate folder because cdk can only upload entire folders
  lambdas.forEach((lambda) => {
    const distFile = lambdaDistFile(lambda);
    const filename = `${handlerFileName}${extname(distFile)}`;

    const uploadDir = lambdaUploadDir(lambda);

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    copyFileSync(distFile, join(uploadDir, filename));
  });
}
