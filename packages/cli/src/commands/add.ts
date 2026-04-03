import * as fs from "node:fs";
import * as path from "node:path";
import { components } from "../registry.js";
import type { Framework } from "./init.js";

const CONFIG_FILE = "strand.config.json";
const FILE_HEADER = "/* Strand UI | MIT License | dillingerstaffing.com */\n";

interface Config {
  cssDir: string;
  componentDir: string;
  framework?: Framework;
}

function loadConfig(): Config | null {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

const PACKAGE_FOR_FRAMEWORK: Record<Framework, string> = {
  preact: "@dillingerstaffing/strand-ui",
  vue: "@dillingerstaffing/strand-vue",
  "css-only": "@dillingerstaffing/strand-ui",
};

function resolvePackagePath(packageName: string): string | null {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    // Handle scoped packages
    const parts = packageName.startsWith("@")
      ? packageName.split("/")
      : [packageName];
    const candidate = path.join(dir, "node_modules", ...parts);
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

  const framework: Framework = config.framework || "preact";
  const packageName = PACKAGE_FOR_FRAMEWORK[framework];
  const files = entry.files[framework];

  const packagePath = resolvePackagePath(packageName);
  if (!packagePath) {
    console.error(`${packageName} is not installed.`);
    console.error("Install it first:\n");
    console.error(`  npm install ${packageName}`);
    process.exit(1);
  }

  const sourceDir = path.join(packagePath, "src", "components", entry.name);
  const targetDir = path.resolve(
    process.cwd(),
    config.componentDir,
    entry.name
  );

  if (!fs.existsSync(sourceDir) && framework !== "css-only") {
    console.error(`Component source not found at ${sourceDir}`);
    console.error(`Make sure ${packageName} includes source files.`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  for (const file of files) {
    // For CSS-only, source CSS from strand-ui (the CSS is shared)
    const srcPackage = file.endsWith(".css")
      ? resolvePackagePath("@dillingerstaffing/strand-ui")
      : packagePath;

    if (!srcPackage) {
      console.log(`  Warning: source package not found for ${file}, skipping`);
      continue;
    }

    const src = path.join(srcPackage, "src", "components", entry.name, file);
    const dest = path.join(targetDir, file);

    if (!fs.existsSync(src)) {
      console.log(`  Warning: ${file} not found in source, skipping`);
      continue;
    }

    const content = fs.readFileSync(src, "utf-8");
    fs.writeFileSync(dest, FILE_HEADER + content);
    console.log(`  ${file} -> ${dest}`);
  }

  console.log(`\n${entry.name} added to ${targetDir} (${framework})`);

  if (framework === "css-only") {
    console.log(
      "\nSee HTML_REFERENCE.md for the HTML structure to use with this CSS."
    );
  }

  // Warn if project doesn't appear to use TypeScript
  if (framework !== "css-only") {
    const hasTsConfig = fs.existsSync(
      path.join(process.cwd(), "tsconfig.json")
    );
    if (!hasTsConfig && framework === "preact") {
      console.log(
        "\nNote: Components are TypeScript (.tsx). For JavaScript projects,"
      );
      console.log(
        "rename .tsx to .jsx and remove type annotations."
      );
    }
  }
}
