import { Plugin } from "vite";

import { dev, parseServerCode, ServerImportLiteral } from "@tlfc/tools";

let tlfcExit: () => Promise<void> | undefined;

export function vitePluginTlfc(): Plugin {
  return {
    name: "vite-plugin-tlfc",
    enforce: "pre",

    configureServer() {
      // don't block vite from restarting
      new Promise(async (resolve) => {
        if (tlfcExit) {
          await tlfcExit();
        }

        tlfcExit = await dev();

        resolve(true);
      });
    },

    async transform(code, id) {
      const isNodeModule = id.includes("node_modules");

      if (isNodeModule) {
        return;
      }

      // replace all server code
      const hasServerImport = code.includes(ServerImportLiteral);
      if (hasServerImport) {
        return parseServerCode(code);
      }
    },
  };
}
