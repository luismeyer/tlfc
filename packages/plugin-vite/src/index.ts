import { Plugin } from "vite";

import { dev, overrideAwsSdk, parseServerCode } from "@tlfc/tools";

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
      const awsSdk = overrideAwsSdk(id, includeAwsSdk);
      if (awsSdk) {
        return awsSdk;
      }

      if (id.includes("node_modules")) {
        return;
      }

      const serverCode = parseServerCode(code);
      if (serverCode) {
        return serverCode;
      }
    },
  };
}
