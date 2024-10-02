import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    // Since we are using workspaces, we also need to include files outside of this projects root
    commonjsOptions: { include: [/packages\/game-state/, /node_modules/] }
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  optimizeDeps: {
    include: ["@monopoly-money/game-state"]
  }
});
