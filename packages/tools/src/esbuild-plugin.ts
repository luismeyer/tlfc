import { Plugin } from "esbuild";
import { promises } from "fs";

import { parseServerCode } from "./parse-server-code";
import { overrideAwsSdk } from "./override-aws-sdk";

type EsbuildPluginTlfcOptions = {
  /**
   * By default @tlfc/tools replaces all '@tlfc/server' imports in your code with '@tlfc/client' imports.
   * If `ignoreEntry` is set to true it will not try to parse the first file in your entryPoints array.
   * You most likely don't need this option, since it is specifically designed to bundle lambda functions.
   */
  ignoreEntry?: boolean;
  /**
   * If set to true the aws-sdk will be included in the bundle.
   */
  includeAwsSdk?: boolean;
};

export function esbuildPluginTlfc(options?: EsbuildPluginTlfcOptions): Plugin {
  const { ignoreEntry, includeAwsSdk } = options ?? {};

  return {
    name: "esbuild-plugin-tlfc",

    setup({ onLoad, initialOptions: { entryPoints } }) {
      // we know entryPoints is a string array because we set it in esbuild.ts
      const entry = ignoreEntry && (entryPoints as string[])[0];

      onLoad({ filter: /tlfc/ }, async ({ path }) => {
        // we assume that all files which are not the lambda entry and use the
        // @tlfc/server package make calls to other lambdas
        if (path === entry) {
          return;
        }

        // omit aws-sdk from the bundle
        const awsSdk = overrideAwsSdk(path, includeAwsSdk);
        if (awsSdk) {
          return { contents: awsSdk };
        }

        if (path.includes("node_modules")) {
          return undefined;
        }

        const code = await promises.readFile(path, "utf8");
        const serverCode = parseServerCode(code);

        if (serverCode) {
          return { contents: serverCode };
        }
      });
    },
  };
}
