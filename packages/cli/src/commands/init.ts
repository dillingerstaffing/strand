import * as fs from "node:fs";
import * as path from "node:path";

const CONFIG_FILE = "strand.config.json";

export type Framework = "preact" | "vue" | "svelte" | "css-only";

function detectFramework(): Framework {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) return "css-only";

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (allDeps.vue) return "vue";
    if (allDeps.svelte) return "svelte";
    if (allDeps.preact || allDeps.react) return "preact";
  } catch {
    // Corrupt package.json, fall through
  }

  return "css-only";
}

const DEFAULT_CONFIG = {
  cssDir: "./src/styles",
  componentDir: "./src/components",
};

function resolvePackagePath(packageName: string): string | null {
  try {
    const resolved = import.meta.resolve?.(packageName);
    if (resolved) {
      const filePath = resolved.startsWith("file://")
        ? new URL(resolved).pathname
        : resolved;
      let dir = path.dirname(filePath);
      while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, "package.json"))) {
          return dir;
        }
        dir = path.dirname(dir);
      }
    }
  } catch {
    // Fall through to manual resolution
  }

  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, "node_modules", packageName);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    dir = path.dirname(dir);
  }
  return null;
}

function copyCssFiles(cssDir: string): boolean {
  const packagePath = resolvePackagePath("@dillingerstaffing/strand");

  if (!packagePath) {
    console.log(
      "\n@dillingerstaffing/strand is not installed. Install it first:\n"
    );
    console.log("  npm install @dillingerstaffing/strand\n");
    console.log("Then run `strand init` again to copy the CSS files.");
    return false;
  }

  const cssSourceDir = path.join(packagePath, "css");
  const files = ["tokens.css", "reset.css", "base.css"];

  fs.mkdirSync(cssDir, { recursive: true });

  for (const file of files) {
    const src = path.join(cssSourceDir, file);
    const dest = path.join(cssDir, file);

    if (!fs.existsSync(src)) {
      console.log(`  Warning: ${file} not found in @dillingerstaffing/strand`);
      continue;
    }

    const content = fs.readFileSync(src, "utf-8");
    const header = `/* Strand UI | MIT License | dillingerstaffing.com */\n`;
    fs.writeFileSync(dest, header + content);
    console.log(`  Copied ${file} -> ${dest}`);
  }

  return true;
}

function strandMdContent(framework: Framework): string {
  const base = `# STRAND.md

This project uses the Strand design language.

When building or modifying UI, read these files:
- node_modules/@dillingerstaffing/strand-ui/HTML_REFERENCE.md (component classes, HTML structure, and composition tripwires)
- https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md (design constraints, token roles, interaction patterns, principles)

Before composing any layout, apply these tests:
- Principle 2: Identify the primary element. If all elements have equal visual weight, the composition has no focal point.
- Principle 9: Largest to smallest text on the same screen must be at least 3:1 ratio. Uniform typography is a spreadsheet.
- Principle 10: Describe the interface in laboratory vocabulary. If it sounds generic, redesign.
`;

  const bulmaNote =
    "Using Bulma? Load @dillingerstaffing/strand/bulma/strand-bulma-compat.css for visual cohesion.";

  if (framework === "vue") {
    return `${base}
Framework: Vue 3. Import components from @dillingerstaffing/strand-vue.
${bulmaNote}
`;
  }

  if (framework === "svelte") {
    return `${base}
Framework: Svelte. Import components from @dillingerstaffing/strand-svelte.
${bulmaNote}
`;
  }

  if (framework === "css-only") {
    return `${base}
Framework: CSS only. Use Strand CSS classes directly per HTML_REFERENCE.md.
${bulmaNote}
`;
  }

  return `${base}
${bulmaNote}
`;
}

function writeStrandMd(framework: Framework): void {
  const strandMdPath = path.join(process.cwd(), "STRAND.md");

  if (fs.existsSync(strandMdPath)) {
    console.log("STRAND.md already exists. Skipping.");
    return;
  }

  fs.writeFileSync(strandMdPath, strandMdContent(framework));
  console.log("Created STRAND.md -- your AI coding agent reads this automatically.");
}

const FRAMEWORK_LABELS: Record<Framework, string> = {
  preact: "Preact/React",
  vue: "Vue 3",
  svelte: "Svelte",
  "css-only": "CSS only",
};

export async function init(): Promise<void> {
  console.log("Strand by Dillinger Staffing -- dillingerstaffing.com\n");

  const framework = detectFramework();
  console.log(`Detected framework: ${FRAMEWORK_LABELS[framework]}`);

  writeStrandMd(framework);

  const configPath = path.join(process.cwd(), CONFIG_FILE);

  if (fs.existsSync(configPath)) {
    console.log(`${CONFIG_FILE} already exists. Skipping.`);
  } else {
    const config = { ...DEFAULT_CONFIG, framework };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
    console.log(`Created ${CONFIG_FILE}`);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const cssDir = path.resolve(process.cwd(), config.cssDir);

  const copied = copyCssFiles(cssDir);

  if (copied) {
    console.log(`\nAdd to your CSS entry file:\n`);
    console.log(`  @import "${config.cssDir}/tokens.css";`);
    console.log(`  @import "${config.cssDir}/reset.css";`);
    console.log(`  @import "${config.cssDir}/base.css";`);
  }

  console.log("\nReady. Your AI coding agent reads STRAND.md automatically.");
}

// Exported for testing
export { detectFramework, strandMdContent };
