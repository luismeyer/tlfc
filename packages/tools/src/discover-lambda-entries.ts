import fs from "fs";
import path from "path";

import { ServerImportLiteral } from "./parse-server-code";
import { DistDirName } from "./esbuild";

export async function discoverLambdaEntries(
  dir: string = process.cwd()
): Promise<string[]> {
  const dirContents = await fs.promises.readdir(dir);

  let result: string[] = [];

  const promises = dirContents.map(async (content) => {
    const filepath = path.join(dir, content);

    if (
      filepath.includes("/node_modules/") ||
      filepath.includes("/cdk.out/") ||
      filepath.includes(`/${DistDirName}/`)
    ) {
      return;
    }

    const stats = fs.statSync(filepath);

    // recurse into subdirectories
    if (stats.isDirectory()) {
      const entries = await discoverLambdaEntries(filepath);
      result = [...result, ...entries];
    }

    if (stats.isFile()) {
      const ext = path.extname(filepath);

      if (ext !== ".js" && ext !== ".ts") {
        return;
      }

      const file = fs.readFileSync(filepath, "utf-8");

      if (file.includes(ServerImportLiteral) && file.includes("createLambda")) {
        result = [...result, filepath];
      }
    }
  });

  await Promise.all(promises);

  return result;
}
