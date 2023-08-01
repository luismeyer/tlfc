import fs from "fs";
import path from "path";
import os from "os";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

import { LambdaOutput } from "../esbuild";
import { log } from "./log";
import { importLambdaDefinition } from "../import-lambda-definition";

const bundles = new Map<string, string>();

const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "tlfc-"));

export async function invokeLambda(
  { bundleFile, definition: { functionName } }: LambdaOutput,
  event: unknown
) {
  // this is a hack to always load the latest cjs bundle with the import.
  // By copying the bundle to a new file the esm import cache is missed
  fs.watch(bundleFile, async () => {
    log(functionName, "changed. Busting the import cache...");

    const prevTmpBundleFile = bundles.get(bundleFile);
    if (prevTmpBundleFile) {
      await fs.promises.rm(prevTmpBundleFile, { force: true });
    }

    const outputFilename = path.basename(bundleFile);
    const filename = `${Date.now()}-${functionName}-${outputFilename}`;
    const tmpBundleFile = path.join(tmpDir, filename);

    try {
      await fs.promises.copyFile(bundleFile, tmpBundleFile);

      bundles.set(bundleFile, tmpBundleFile);
    } catch (error) {
      log(`failed to bust import cache: ${error}`);
    }
  });

  const cacheBustingBundle = bundles.get(bundleFile) ?? bundleFile;

  const definition = await importLambdaDefinition(cacheBustingBundle);

  return definition.handler(
    event as APIGatewayProxyEvent,
    {} as Context,
    () => undefined
  );
}
