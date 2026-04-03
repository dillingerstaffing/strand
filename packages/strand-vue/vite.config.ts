import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import * as fs from "node:fs";
import * as path from "node:path";

// Collect component CSS from strand-ui source (shared CSS, zero duplication)
function collectCss(): import("vite").Plugin {
  return {
    name: "collect-css",
    closeBundle() {
      const strandUiSrc = path.resolve(__dirname, "../strand-ui/src");
      const componentsDir = path.join(strandUiSrc, "components");
      const staticCss = path.join(strandUiSrc, "static.css");
      const outDir = path.resolve(__dirname, "dist/css");

      fs.mkdirSync(outDir, { recursive: true });

      const banner = `/*! Strand UI | MIT License | dillingerstaffing.com */\n\n`;
      let css = banner;

      // Collect component CSS
      if (fs.existsSync(componentsDir)) {
        const dirs = fs.readdirSync(componentsDir, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .sort((a, b) => a.name.localeCompare(b.name));
        for (const dir of dirs) {
          const cssFile = path.join(componentsDir, dir.name, `${dir.name}.css`);
          if (fs.existsSync(cssFile)) {
            css += `/* ${dir.name} */\n`;
            css += `${banner}`;
            css += fs.readFileSync(cssFile, "utf-8");
            css += "\n\n";
          }
        }
      }

      // Append static.css (presentation mode, viewport, utilities)
      if (fs.existsSync(staticCss)) {
        css += `/* Static & Utilities */\n`;
        css += fs.readFileSync(staticCss, "utf-8");
        css += "\n";
      }

      fs.writeFileSync(path.join(outDir, "strand-ui.css"), css);
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ["src/**/*.ts", "src/**/*.vue"],
      outDir: "dist",
    }),
    collectCss(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    sourcemap: true,
  },
});
