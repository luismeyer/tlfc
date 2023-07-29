import { defineConfig } from "vite";
import { vitePluginTlfc } from "@tlfc/vite";

export default defineConfig({
  plugins: [vitePluginTlfc()],
  optimizeDeps: {
    include: ["@tlfc/client"],
  },
  build: {
    commonjsOptions: {
      include: [/client/, /node_modules/],
    },
  },
});
