import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxyOptions = {
  target: `http://127.0.0.1:4000`,
  changeOrigin: false,
  secure: true,
  ws: false
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/autosocial/",
  server: {
    host: "localhost",
    port: 5172,
    // hmr: hmrConfig,
    proxy: {
      "^/(\\?.*)?$": proxyOptions,
      "^/api(/|(\\?.*)?$)": proxyOptions
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  }
});
