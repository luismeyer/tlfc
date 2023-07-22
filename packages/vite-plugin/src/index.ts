import { Plugin } from "vite";

import { parseServerCode, ServerImportLiteral } from "@tlfc/tools";

export function vitePluginTlfc(): Plugin {
  return {
    name: "vite-plugin-tlfc",
    enforce: "pre",

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
