import fs from "fs";
import path from "path";
import { ServerImportLiteral } from "./parse-server-code";

export async function discoverLambdaEntries(
  dir: string = process.cwd()
): Promise<string[]> {
  const dirContents = await fs.promises.readdir(dir);

  let result: string[] = [];

  const promises = dirContents.map(async (content) => {
    const filepath = path.join(dir, content);

    // Ignore node_modules
    if (filepath.includes("node_modules")) {
      return;
    }

    const stats = fs.statSync(filepath);

    // recurse into subdirectories
    if (stats.isDirectory()) {
      const entries = await discoverLambdaEntries(filepath);
      result = [...result, ...entries];
    }

    if (stats.isFile()) {
      const file = fs.readFileSync(filepath, "utf-8");

      if (file.includes(ServerImportLiteral) && file.includes("createLambda")) {
        result = [...result, filepath];
      }
    }
  });

  await Promise.all(promises);

  return result;
}
