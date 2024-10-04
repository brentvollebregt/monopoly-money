import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    outDir: "build",
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
  },
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "../../node_modules/bootstrap")
    }
  }
});
