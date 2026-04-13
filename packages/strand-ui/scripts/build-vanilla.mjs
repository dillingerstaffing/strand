// Build the vanilla runtime IIFE from TypeScript source.
// Uses Vite's internal esbuild to compile TS, then wraps as IIFE.
// No additional dependencies required.

import { build } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

await build({
	root,
	configFile: false,
	build: {
		lib: {
			entry: resolve(root, "src/vanilla/strand-ui.ts"),
			formats: ["iife"],
			name: "StrandUI",
			fileName: () => "strand-ui.js",
		},
		outDir: resolve(root, "dist/vanilla"),
		emptyOutDir: false,
		minify: false,
		rollupOptions: {
			output: {
				// No hash in filename
				entryFileNames: "strand-ui.js",
			},
		},
	},
	logLevel: "warn",
});
