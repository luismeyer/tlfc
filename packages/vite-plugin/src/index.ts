import { Plugin } from "vite";

import { dev, parseServerCode, ServerImportLiteral } from "@tlfc/tools";

export function vitePluginTlfc(): Plugin {
  let isDev = false;

  return {
    name: "vite-plugin-tlfc",
    enforce: "pre",

    configResolved(resolvedConfig) {
      // store the resolved config
      isDev = resolvedConfig.command === "serve";
    },

    async configureServer() {
      if (isDev) {
        // start tlfc dev server
        await dev();
      }
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
