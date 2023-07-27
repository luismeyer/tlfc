import crypto from "crypto";
import fs from "fs";

import { LambdaOutput } from "../esbuild";

const hashMap = new Map<string, string>();

async function createFileHash(file: string) {
  const hash = crypto.createHash("sha256");

  const content = await fs.promises.readFile(file);
  hash.update(content);

  return hash.digest("hex");
}

export async function invokeLambda(
  { bundleFile }: LambdaOutput,
  event: unknown
) {
  const hash = await createFileHash(bundleFile);

  // use the latest bundle when the file hash changed
  if (hashMap.get(bundleFile) !== hash) {
    require.cache[bundleFile] = undefined;

    hashMap.set(bundleFile, hash);
  }

  const lambdaBundle = await import(bundleFile);

  return lambdaBundle.default.handler(event);
}
