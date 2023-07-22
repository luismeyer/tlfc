import { Plugin } from "esbuild";
import { promises } from "fs";

import { parseServerCode, ServerImportLiteral } from "./parse-server-code";

export const EsbuildPlugin: Plugin = {
  name: "esbuild-plugin-tlfc",

  setup({ onLoad, initialOptions: { entryPoints } }) {
    // we know entryPoints is a string array because we set it in esbuild.ts
    const [entry] = entryPoints as string[];

    onLoad({ filter: /tlfc/ }, async (args) => {
      const isLambdaEntry = args.path === entry;
      const isNodeModule = args.path.includes("node_modules");

      // we assume that all files which are not the lambda entry and use the
      // @tlfc/server package make calls to other lambdas
      if (isLambdaEntry || isNodeModule) {
        return undefined;
      }

      const text = await promises.readFile(args.path, "utf8");

      if (!text.includes(ServerImportLiteral)) {
        return;
      }

      return { contents: parseServerCode(text) };
    });
  },
};
