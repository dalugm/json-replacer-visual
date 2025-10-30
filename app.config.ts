import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // Avoid optimize wasm in dev.
      exclude: ["json-replacer"],
    },
  },
});
