import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Since we are using workspaces, we also need to include files outside of this projects root
    commonjsOptions: { include: [/packages\/game-state/, /node_modules/] }
  }
});
