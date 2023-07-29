import { Plugin } from "vite";

import { dev, parseServerCode, ServerImportLiteral } from "@tlfc/tools";

let stopTlfcDev: () => Promise<void> | undefined;

type VitePluginTlfcOptions = {
  includeAwsSdk?: boolean;
  quiet?: boolean;
  disableDevServer?: boolean;
};

async function startTlfcDev(quiet?: boolean) {
  if (stopTlfcDev) {
    await stopTlfcDev();
  }

  stopTlfcDev = await dev({ quiet });
}

export function vitePluginTlfc(
  options: VitePluginTlfcOptions | undefined
): Plugin {
  const { includeAwsSdk, disableDevServer, quiet } = options || {};

  return {
    name: "vite-plugin-tlfc",
    enforce: "pre",

    configureServer() {
      if (disableDevServer) {
        return;
      }

      // don't await so we don't block vite from starting
      startTlfcDev(quiet);
    },

    configurePreviewServer() {
      if (disableDevServer) {
        return;
      }

      // don't await so we don't block vite from starting
      startTlfcDev(quiet);
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
