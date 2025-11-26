import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/30dmc-2025-day-21/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        nested: resolve(__dirname, "icons/index.html"),
      },
    },
  },
});
