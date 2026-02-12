import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/effects/dust/embed.js",
      name: "Dust",
      fileName: (format) => `dust.${format}.js`,
      formats: ["umd"],
    },
  },
});
