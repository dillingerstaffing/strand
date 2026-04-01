import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["js/**/*.test.ts"],
    coverage: {
      include: ["js/**/*.ts"],
      exclude: ["js/**/*.test.ts"],
    },
  },
});
