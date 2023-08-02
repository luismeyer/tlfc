import { Plugin } from "vite";

import { dev, parseServerCode, ServerImportLiteral } from "@tlfc/tools";

type VitePluginTlfcOptions = {
  includeAwsSdk?: boolean;
  quiet?: boolean;
  disableDevServer?: boolean;
};

export function vitePluginTlfc(
  options: VitePluginTlfcOptions | undefined
): Plugin {
  const { includeAwsSdk, disableDevServer, quiet } = options || {};

  let isDevMode = false;

  let stopServer: () => Promise<void> | undefined;

  return {
    name: "vite-plugin-tlfc",
    enforce: "pre",

    async configureServer() {
      isDevMode = true;
    },

    // is invoked when the vite server is started
    async buildStart() {
      if (!isDevMode || disableDevServer) {
        return;
      }

      if (stopServer) {
        stopServer();
      }

      stopServer = await dev({ quiet });
    },

    // is invoked when the vite server is stopped
    async buildEnd() {
      if (!stopServer) {
        return;
      }

      await stopServer();
    },

    async transform(code, id) {
      // omit aws-sdk from the bundle
      if (!includeAwsSdk && id.includes("@aws-sdk/client-lambda")) {
        // rewrite the imports we use in the create-sdk-call.ts file
        return `
          export const InvokeCommand = null;
          export const LambdaClient = null;
          export default null;
        `;
      }

      if (id.includes("node_modules")) {
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
