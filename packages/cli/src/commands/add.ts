import * as fs from "node:fs";
import * as path from "node:path";
import { components } from "../registry.js";

const CONFIG_FILE = "strand.config.json";
const FILE_HEADER = "/* Strand UI | MIT License | dillingerstaffing.com */\n";

function loadConfig(): { cssDir: string; componentDir: string } | null {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

function resolveStrandUiPath(): string | null {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(
      dir,
      "node_modules",
      "@dillingerstaffing",
      "strand-ui"
    );
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    dir = path.dirname(dir);
  }
  return null;
}

export async function add(componentName: string): Promise<void> {
  if (!componentName) {
    console.error("Usage: strand add <component>");
    console.error("Run `strand list` to see available components.");
    process.exit(1);
  }

  const key = componentName.toLowerCase();
  const entry = components.get(key);

  if (!entry) {
    console.error(`Unknown component: "${componentName}"`);
    console.error("Run `strand list` to see available components.");
    process.exit(1);
  }

  const config = loadConfig();
  if (!config) {
    console.error(
      "No strand.config.json found. Run `strand init` first."
    );
    process.exit(1);
  }

  const strandUiPath = resolveStrandUiPath();
  if (!strandUiPath) {
    console.error(
      "@dillingerstaffing/strand-ui is not installed."
    );
    console.error("Install it first:\n");
    console.error("  npm install @dillingerstaffing/strand-ui");
    process.exit(1);
  }

  const sourceDir = path.join(
    strandUiPath,
    "src",
    "components",
    entry.name
  );
  const targetDir = path.resolve(
    process.cwd(),
    config.componentDir,
    entry.name
  );

  if (!fs.existsSync(sourceDir)) {
    console.error(
      `Component source not found at ${sourceDir}`
    );
    console.error(
      "Make sure @dillingerstaffing/strand-ui includes source files."
    );
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  for (const file of entry.files) {
    const src = path.join(sourceDir, file);
    const dest = path.join(targetDir, file);

    if (!fs.existsSync(src)) {
      console.log(`  Warning: ${file} not found in source, skipping`);
      continue;
    }

    const content = fs.readFileSync(src, "utf-8");
    fs.writeFileSync(dest, FILE_HEADER + content);
    console.log(`  ${file} -> ${dest}`);
  }

  console.log(`\n${entry.name} added to ${targetDir}`);

  // Warn if project doesn't appear to use TypeScript
  const hasTsConfig = fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
  if (!hasTsConfig) {
    console.log(
      "\nNote: Strand UI components are TypeScript (.tsx). If your project"
    );
    console.log(
      "uses JavaScript, rename .tsx files to .jsx and remove type annotations."
    );
  }
}
