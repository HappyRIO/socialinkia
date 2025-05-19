import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // "/": {
      //   target: "http://localhost:4000",
      //   changeOrigin: true,
      // },
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500, // Set to something higher than 500 KB

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
            if (id.includes("tailwind")) return "tailwind";
            return "vendor";
          }
        },
      },
    },
  },
});
