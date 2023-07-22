import { defineConfig } from "vite";
import { vitePluginTlfc } from "@tlfc/vite";

export default defineConfig({
  optimizeDeps: {
    include: ["@tlfc/client"],
  },
  build: {
    commonjsOptions: {
      include: [/@tlfc\/client/],
    },
  },
  plugins: [vitePluginTlfc()],
});
