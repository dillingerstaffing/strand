import { defineConfig } from "vite";
import { resolve } from "node:path";
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { stripComments } from "./build/strip-comments.mjs";

/**
 * Assemble dist/css/strand-ui.css. Order is the cascade, so it is explicit:
 * every components/<Dir>/<Dir>.css in code-point order, then the sheets that
 * intentionally sit after components. See docs/css-architecture.md.
 */
function collectCss() {
  return {
    name: "collect-css",
    closeBundle() {
      const src = resolve(__dirname, "src");
      const componentsDir = resolve(src, "components");
      const dirs = readdirSync(componentsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

      const sheets = [
        ...dirs.map((dir) => [dir, resolve(componentsDir, dir, `${dir}.css`)]),
        ["Typography", resolve(src, "typography.css")],
        ["Utilities", resolve(src, "utilities.css")],
        ["Static", resolve(src, "static.css")],
      ].filter(([, path]) => existsSync(path));

      let allCss = "/*! Strand UI v0.63.0 | MIT License | dillingerstaffing.com */\n\n";
      for (const [name, path] of sheets) {
        allCss += `/* ${name} */\n${readFileSync(path, "utf-8")}\n\n`;
      }

      mkdirSync(resolve(__dirname, "dist/css"), { recursive: true });
      writeFileSync(resolve(__dirname, "dist/css/strand-ui.css"), stripComments(allCss));
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "preact",
        "preact/hooks",
        "preact/compat",
        "preact/jsx-runtime",
      ],
    },
    outDir: "dist",
  },
  plugins: [collectCss()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxImportSource: "preact",
  },
});
