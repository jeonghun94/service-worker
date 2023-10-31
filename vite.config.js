import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./src",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("sw.js")) {
            return "sw";
          }
        },
      },
    },
  },
  publicDir: "public", //
});
