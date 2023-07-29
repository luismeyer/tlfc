import { Plugin } from "vite";

import { dev, parseServerCode, ServerImportLiteral } from "@tlfc/tools";

let stopTlfcDev: () => Promise<void> | undefined;

type VitePluginTlfcOptions = {
  includeAwsSdk?: boolean;
};

export function vitePluginTlfc(
  options: VitePluginTlfcOptions | undefined
): Plugin {
  const { includeAwsSdk } = options || {};

  return {
    name: "vite-plugin-tlfc",
    enforce: "pre",

    configureServer() {
      // don't block vite from restarting
      new Promise(async (resolve) => {
        if (stopTlfcDev) {
          await stopTlfcDev();
        }

        stopTlfcDev = await dev();

        resolve(true);
      });
    },

    async transform(code, id) {
      const isNodeModule = id.includes("node_modules");

      // omit aws-sdk from the bundle
      if (!includeAwsSdk && id.includes("@aws-sdk/client-lambda")) {
        return "export default null";
      }

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
