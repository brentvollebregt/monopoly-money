import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    // Since we are using workspaces, we also need to include files outside of this projects root
    commonjsOptions: { include: [/packages\/game-state/, /node_modules/] }
  }
});
