import { defineConfig } from "vite";
import { vitePluginTlfc } from "@tlfc/vite";

export default defineConfig({
  optimizeDeps: {
    include: ["@tlfc/client", "@tlfc/core"],
  },
  build: {
    commonjsOptions: {
      include: [/@tlfc\/client/, /@tlfc\/core/],
    },
  },
  plugins: [vitePluginTlfc()],
});
