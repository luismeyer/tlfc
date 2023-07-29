import crypto from "crypto";
import fs from "fs";

import { LambdaOutput } from "../esbuild";

const bundleHashMap = new Map<string, string>();

function createHash(content: crypto.BinaryLike) {
  const hash = crypto.createHash("sha256");
  hash.update(content);
  return hash.digest("hex");
}

async function createFileHash(file: string) {
  const content = await fs.promises.readFile(file);
  return createHash(content);
}

export async function invokeLambda(
  { bundleFile }: LambdaOutput,
  event: unknown
) {
  const fileHash = await createFileHash(bundleFile);

  // use the latest bundle when the file hash changed
  if (bundleHashMap.get(bundleFile) !== fileHash) {
    require.cache[bundleFile] = undefined;

    bundleHashMap.set(bundleFile, fileHash);
  }

  const lambdaBundle = await import(bundleFile);

  return lambdaBundle.default.handler(event);
}
