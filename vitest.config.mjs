import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["scripts/__tests__/**/*.test.mjs"],
		// Run test files sequentially to avoid race conditions
		// when multiple test files write to the same output files
		// (registry.json, llms.txt, etc.)
		fileParallelism: false,
	},
});
