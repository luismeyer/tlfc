// @ts-check

import esbuild from "esbuild";

const args = process.argv;

export async function buildOrWatch() {
  const watch = args.includes("--watch");

  /**
   * @type { import("esbuild").BuildOptions }
   */
  const options = {
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    packages: "external",
    format: "esm",
    bundle: true,
    minify: !watch,
    logLevel: "info",
  };

  if (watch) {
    const buildContext = await esbuild.context(options);

    await buildContext.watch();
  } else {
    await esbuild.build(options);
  }
}
