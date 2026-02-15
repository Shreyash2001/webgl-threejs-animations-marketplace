import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const entries = {
    dust: "src/Effects/Dust/embed.js",
    flowingLiquid: "src/Effects/FlowingLiquid/embed.js",
  };

  return {
    plugins: [react()],
    build: {
      emptyOutDir: false,
      lib: {
        entry: entries[mode],
        name: mode,
        formats: ["umd"],
        fileName: () => `${mode}.umd.js`,
      },
    },
  };
});
