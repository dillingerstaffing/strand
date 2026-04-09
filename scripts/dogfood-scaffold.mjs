#!/usr/bin/env node
// Dogfood chamber scaffold.
//
// Creates a new Strand UI showcase directory at packages/strand-examples/<name>/
// pre-wired with Vite + Preact + TypeScript and a pinned @dillingerstaffing/strand-ui
// dependency from the npm registry. The showcase is OUTSIDE the pnpm workspace
// (see pnpm-workspace.yaml) so that its install pulls from npm exactly the way
// an external consumer would.
//
// Usage:
//   pnpm dogfood pricing-page
//   node scripts/dogfood-scaffold.mjs pricing-page
//
// After scaffolding, the script prints instructions telling the operator to
// open a fresh Claude Code session inside this Strand repo directory and paste
// the contents of .dogfood-launch.md as the first message. A fresh session
// with cwd inside this repo is the only verifiable isolation path: the
// session has no filesystem visibility outside the repo.

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
	console.error("\n  USAGE: pnpm dogfood <name>\n");
	console.error(
		"  The name must be lowercase kebab-case (e.g. pricing-page, data-dashboard).\n",
	);
	process.exit(1);
}

async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function readJson(path) {
	return JSON.parse(await readFile(path, "utf8"));
}

async function writeFileEnsuringDir(path, content) {
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, content, "utf8");
}

async function main() {
	const showcaseDir = join(REPO_ROOT, "packages", "strand-examples", name);
	if (await exists(showcaseDir)) {
		console.error(`\n  ABORT: ${showcaseDir} already exists.`);
		console.error(
			"  Pick a different name, or delete the directory first if you intend to start over.\n",
		);
		process.exit(1);
	}

	const rootPkg = await readJson(join(REPO_ROOT, "package.json"));
	const strandVersion = rootPkg.version;

	const files = template({ name, strandVersion });

	for (const [relPath, content] of Object.entries(files)) {
		await writeFileEnsuringDir(join(showcaseDir, relPath), content);
	}

	console.log(`\n  SCAFFOLDED: packages/strand-examples/${name}/`);
	console.log(`  Pinned @dillingerstaffing/strand-ui: ${strandVersion}`);
	console.log("");
	console.log("  NEXT STEPS");
	console.log("  ──────────");
	console.log("  1. Open a NEW terminal window.");
	console.log("  2. In that new terminal, cd into this Strand repo and start");
	console.log("     a fresh Claude Code session:");
	console.log("       cd <path-to-this-strand-repo>");
	console.log("       claude");
	console.log("  3. In that fresh session, paste the contents of:");
	console.log(`       packages/strand-examples/${name}/.dogfood-launch.md`);
	console.log("  4. The Consumer Agent will read only files inside this Strand");
	console.log("     repo and build the showcase. When it is done, review the");
	console.log("     result in a browser.");
	console.log("  5. To audit for forbidden-term leaks, run:");
	console.log(`       pnpm audit-dogfood ${name}`);
	console.log("");
	console.log(
		"  DO NOT run the Consumer Agent from any terminal whose filesystem",
	);
	console.log(
		"  scope extends outside this Strand repo. The isolation invariant",
	);
	console.log("  requires a fresh session whose cwd is inside this repo.");
	console.log("");
}

function template({ name, strandVersion }) {
	const displayName = name
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");

	return {
		"package.json": `${JSON.stringify(
			{
				name: `@dillingerstaffing/strand-example-${name}`,
				private: true,
				version: "0.0.0",
				description: `Strand UI Showcase: ${displayName}. Built with only Strand's public artifacts as a dogfood stress test.`,
				type: "module",
				scripts: {
					dev: "vite",
					build: "vite build",
					preview: "vite preview",
					typecheck: "tsc --noEmit",
				},
				dependencies: {
					preact: "^10.22.0",
					"@dillingerstaffing/strand": strandVersion,
					"@dillingerstaffing/strand-ui": strandVersion,
				},
				devDependencies: {
					"@preact/preset-vite": "^2.9.0",
					typescript: "^5.7.0",
					vite: "^5.4.0",
				},
			},
			null,
			2,
		)}\n`,

		"vite.config.ts": `import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
`,

		"tsconfig.json": `${JSON.stringify(
			{
				compilerOptions: {
					target: "ES2022",
					module: "ESNext",
					moduleResolution: "bundler",
					jsx: "preserve",
					jsxImportSource: "preact",
					strict: true,
					esModuleInterop: true,
					skipLibCheck: true,
					forceConsistentCasingInFileNames: true,
					resolveJsonModule: true,
					isolatedModules: true,
					noEmit: true,
					lib: ["ES2022", "DOM", "DOM.Iterable"],
				},
				include: ["src/**/*.ts", "src/**/*.tsx"],
			},
			null,
			2,
		)}\n`,

		"index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Strand UI Showcase: ${displayName}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@${strandVersion}/css/tokens.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@${strandVersion}/css/reset.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@${strandVersion}/css/base.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand-ui@${strandVersion}/dist/css/strand-ui.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,

		"src/main.tsx": `import { render } from "preact";
import { App } from "./App";

const root = document.getElementById("app");
if (root) render(<App />, root);
`,

		"src/App.tsx": `// The Consumer Agent replaces this file with the actual showcase.
// The only constraint: use ONLY Strand primitives from @dillingerstaffing/strand-ui.
// No custom CSS. No non-Strand design tokens. No raw hex colors.

export function App() {
  return (
    <main>
      <h1>Strand UI Showcase: ${displayName}</h1>
      <p>Consumer Agent has not built this showcase yet.</p>
    </main>
  );
}
`,

		".gitignore": `node_modules
dist
.vite
*.log
`,

		".dogfood-launch.md": launchPrompt({ name, displayName, strandVersion }),
	};
}

function launchPrompt({ name, displayName, strandVersion }) {
	return `# Dogfood Launch Prompt: ${displayName}

You are a Strand UI showcase builder. Your job is to build a world-class showcase that demonstrates what Strand UI can do. The showcase will be evaluated visually by a human and against automated gates (accessibility, performance, purity).

## Your reading list (these files only, nothing else)

Start with AGENTS.md. It is the entry point for usage rules and tells you how Strand expects agents to work with the library.

- \`AGENTS.md\` at this repository root (agent usage rules; read this first)
- \`llms.txt\` at this repository root (concise machine-readable project summary)
- \`README.md\` at this repository root
- \`DESIGN_LANGUAGE.md\` at this repository root (the design specification)
- \`CONSUMERS.md\` at this repository root (how consumers use Strand)
- \`HTML_REFERENCE.md\` at this repository root (CSS class API for vanilla HTML consumers; useful for understanding available primitives)
- \`docs/migration/from-bulma.md\` (migration guide for Bulma users)
- \`docs/migration/from-bootstrap.md\` (migration guide for Bootstrap users)
- \`packages/strand-ui/README.md\` (Preact/React component library overview)
- \`packages/strand-ui/src/components/*/\` directories (to see each component's source and infer its API)
- \`packages/strand-examples/${name}/\` (your working directory; scaffold is already in place)

## Your scope

- Do NOT read any file outside this repository.
- Do NOT read any file in any parent directory of this repository.
- Do NOT install or import any design-system library other than \`@dillingerstaffing/strand-ui\` and \`@dillingerstaffing/strand\`.
- Do NOT write any custom CSS. Use only Strand primitives and Strand tokens. If a visual effect requires custom CSS, that is feedback about a gap in Strand; stop and report it instead of working around it.
- Do NOT use any raw hex color, raw pixel value, or any design token not defined in Strand.

## Showcase brief

Build a **${displayName}** page using only Strand UI primitives. The page should look magnitudes better than any award-winning UI gallery's version of this page type.

Focus areas:
1. Visual hierarchy using Strand's typography scale
2. Composition using Strand's layout primitives (Stack, Grid, Container, Section)
3. Interactive elements using Strand's form and feedback components where relevant
4. Accessibility: correct heading hierarchy, ARIA where needed, keyboard navigable, WCAG 2.2 AA contrast
5. Performance: the built page should have minimal CSS/JS beyond what Strand provides

Build the page in \`src/App.tsx\`. If you need multiple components or helper files, add them under \`src/\`. The build output lands in \`dist/\`.

## Your workflow

1. \`cd packages/strand-examples/${name}\`
2. \`npm install\` (pulls published \`@dillingerstaffing/strand-ui@${strandVersion}\` from npm)
3. Read the files listed in "Your reading list" above, completely.
4. Think about the showcase design using only Strand primitives.
5. Replace \`src/App.tsx\` with your showcase.
6. \`npm run dev\` to iterate; \`npm run build\` to produce the final static output.
7. \`npm run typecheck\` to verify no TypeScript errors.
8. When you are done, write a short \`SHOWCASE.md\` in the showcase directory summarizing: what was built, which Strand primitives were used, any moments where you wanted a primitive that did not exist (these are gap reports that flow to the feedback loop).

## Quality gates

Your output will be evaluated against:

1. **Visual quality.** Binary human call. Magnitudes better than award-winning UI or it fails.
2. **Purity.** \`pnpm purity-scan\` (run from this repository root) must find zero non-Strand classes and zero raw hex colors in your built CSS.
3. **Accessibility.** axe-core WCAG 2.2 AA pass, zero violations.
4. **Performance.** First Contentful Paint under 1.2s on 4G throttle.
5. **Leak check.** \`pnpm audit-dogfood ${name}\` must find zero references to the operator's configured forbidden term list in your showcase source.

If any gate fails, the showcase does not graduate. Rework it.

## If you find a gap

If you discover that Strand UI does not have a primitive you need for a world-class result, STOP and report it in \`SHOWCASE.md\` under a heading "Gaps found". Describe: what you wanted, why it was needed, what you had to work around. This is the most valuable output of the dogfood chamber. Gaps become future Strand improvements.

Do not hack around gaps with custom CSS. Report them and then adapt the showcase to what Strand can currently do, or choose a different composition that avoids the gap.

## Begin

Read the files in your reading list. Think about the showcase. Build it in \`src/App.tsx\`. Verify it against the quality gates. Write \`SHOWCASE.md\`. Hand off.
`;
}

main().catch((err) => {
	console.error("\n  SCAFFOLD ERROR:", err.message);
	console.error(err.stack);
	process.exit(2);
});
