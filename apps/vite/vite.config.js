import { defineConfig } from "vite";
import { vitePluginTlfc } from "@tlfc/vite";

export default defineConfig({
  clearScreen: false,
  plugins: [vitePluginTlfc()],
});
