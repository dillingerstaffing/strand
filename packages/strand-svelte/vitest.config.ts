import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ hot: false, compilerOptions: { hmr: false } })],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test-setup.ts"],
    alias: {
      // Ensure testing-library/svelte uses browser bundle
      'svelte': 'svelte',
    },
  },
  resolve: {
    conditions: ["browser"],
  },
});
