import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

// Collect all component CSS into a single file after build
function collectCss() {
  return {
    name: "collect-css",
    closeBundle() {
      const componentsDir = resolve(__dirname, "src/components");
      const dirs = readdirSync(componentsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

      let allCss = "/*! Strand UI v0.2.0 | MIT License | dillingerstaffing.com */\n\n";

      for (const dir of dirs) {
        try {
          const cssPath = resolve(componentsDir, dir, `${dir}.css`);
          const css = readFileSync(cssPath, "utf-8");
          allCss += `/* ${dir} */\n${css}\n\n`;
        } catch {
          // Component has no CSS file, skip
        }
      }

      // Append static presentation mode CSS
      try {
        const staticCss = readFileSync(resolve(__dirname, "src/static.css"), "utf-8");
        allCss += `/* Static */\n${staticCss}\n\n`;
      } catch {
        // static.css not found, skip
      }

      mkdirSync(resolve(__dirname, "dist/css"), { recursive: true });
      writeFileSync(resolve(__dirname, "dist/css/strand-ui.css"), allCss);
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
