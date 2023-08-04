// @ts-check

import esbuild from "esbuild";
import { esbuildPluginTlfc } from "@tlfc/esbuild";

const args = process.argv;

const watch = args.includes("--watch");

/**
 * @type { import("esbuild").BuildOptions }
 */
const options = {
  entryPoints: ["client/main.ts"],
  outfile: "dist/client.js",
  format: "esm",
  platform: "browser",
  bundle: true,
  logLevel: "info",
  plugins: [esbuildPluginTlfc()],
};

if (watch) {
  const buildContext = await esbuild.context(options);

  await buildContext.watch();
} else {
  await esbuild.build(options);
}
