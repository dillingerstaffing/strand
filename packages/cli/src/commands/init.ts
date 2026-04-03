import * as fs from "node:fs";
import * as path from "node:path";

const CONFIG_FILE = "strand.config.json";

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
      // Walk up from the resolved entry point to find the package root
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

  // Manual resolution: walk up from cwd looking for node_modules
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

const STRAND_MD = `# STRAND.md

This project uses the Strand design language.

When building or modifying UI, read these files:
- node_modules/@dillingerstaffing/strand-ui/HTML_REFERENCE.md (component classes and HTML structure)
- https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md (design constraints, token roles, interaction patterns, principles)
`;

function writeStrandMd(): void {
  const strandMdPath = path.join(process.cwd(), "STRAND.md");

  if (fs.existsSync(strandMdPath)) {
    console.log("STRAND.md already exists. Skipping.");
    return;
  }

  fs.writeFileSync(strandMdPath, STRAND_MD);
  console.log("Created STRAND.md -- your AI coding agent reads this automatically.");
}

export async function init(): Promise<void> {
  console.log("Strand by Dillinger Staffing -- dillingerstaffing.com\n");

  writeStrandMd();

  const configPath = path.join(process.cwd(), CONFIG_FILE);

  if (fs.existsSync(configPath)) {
    console.log(`${CONFIG_FILE} already exists. Skipping.`);
  } else {
    fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n");
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
