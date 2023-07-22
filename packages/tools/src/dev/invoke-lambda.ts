import crypto from "crypto";
import fs from "fs";

import { AnyLambda } from "../";
import { lambdaBundleFile } from "../esbuild";

const hashMap = new Map<string, string>();

async function createFileHash(file: string) {
  const hash = crypto.createHash("sha256");

  const content = await fs.promises.readFile(file);
  hash.update(content);

  return hash.digest("hex");
}

export async function invokeLambda(lambda: AnyLambda, event: unknown) {
  const bundleFile = lambdaBundleFile(lambda);

  const hash = await createFileHash(bundleFile);

  // use the latest bundle when the file hash changed
  if (hashMap.get(bundleFile) !== hash) {
    require.cache[bundleFile] = undefined;

    hashMap.set(bundleFile, hash);
  }

  const lambdaBundle = await import(bundleFile);

  return lambdaBundle.default.handler(event);
}
