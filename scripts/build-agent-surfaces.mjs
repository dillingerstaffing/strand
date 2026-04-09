#!/usr/bin/env node
// build-agent-surfaces.mjs
//
// Generates agent-consumable surfaces from Strand source files:
//   - llms.txt       (doc index per llmstxt.org spec)
//   - llms-full.txt  (concatenated full docs)
//   - registry.json  (shadcn-compatible component registry)
//   - README.md      (DOCMAP + COMPONENT-COUNT marker replacement)
//
// Run via:
//   node scripts/build-agent-surfaces.mjs
//   pnpm build:agent-surfaces

import { access, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// PUBLIC_DOCS: the canonical list of public documentation surfaces.
// Order matters: primary docs first, optional/supplementary last.
// ---------------------------------------------------------------------------

const PUBLIC_DOCS = [
	{
		name: "README",
		path: "./README.md",
		purpose: "Install, configure, start building",
		url: "https://github.com/dillingerstaffing/strand/blob/main/README.md",
		section: "docs",
	},
	{
		name: "AGENTS.md",
		path: "./AGENTS.md",
		purpose: "AI coding agent usage instructions",
		url: "https://github.com/dillingerstaffing/strand/blob/main/AGENTS.md",
		section: "docs",
	},
	{
		name: "HTML Reference",
		path: "./generated/html-reference.md",
		purpose: "CSS class API for every component",
		url: "https://github.com/dillingerstaffing/strand/blob/main/generated/html-reference.md",
		section: "docs",
	},
	{
		name: "Design Language",
		path: "./docs/design-language.md",
		purpose: "Complete design specification",
		url: "https://github.com/dillingerstaffing/strand/blob/main/docs/design-language.md",
		section: "docs",
	},
	{
		name: "Consumers",
		path: "./generated/consumers.md",
		purpose: "Consumer types and framework parity",
		url: "https://github.com/dillingerstaffing/strand/blob/main/generated/consumers.md",
		section: "docs",
	},
	{
		name: "Changelog",
		path: "./generated/changelog.md",
		purpose: "Version history",
		url: "https://github.com/dillingerstaffing/strand/blob/main/generated/changelog.md",
		section: "optional",
	},
	{
		name: "Contributing",
		path: "./CONTRIBUTING.md",
		purpose: "How to contribute",
		url: "https://github.com/dillingerstaffing/strand/blob/main/CONTRIBUTING.md",
		section: "optional",
	},
	{
		name: "Bulma Migration",
		path: "./docs/migration/from-bulma.md",
		purpose: "Use Strand alongside Bulma",
		url: "https://github.com/dillingerstaffing/strand/blob/main/docs/migration/from-bulma.md",
		section: "optional",
	},
	{
		name: "Bootstrap Migration",
		path: "./docs/migration/from-bootstrap.md",
		purpose: "Use Strand alongside Bootstrap",
		url: "https://github.com/dillingerstaffing/strand/blob/main/docs/migration/from-bootstrap.md",
		section: "optional",
	},
	{
		name: "Strand Lab Page",
		path: null,
		purpose: "Live showcase and brand entry point",
		url: "https://dillingerstaffing.com/labs/strand",
		section: "docs",
	},
];

// ---------------------------------------------------------------------------
// Component descriptions: sourced from the README component tables.
// Keyed by PascalCase component name from parity-manifest.json.
// ---------------------------------------------------------------------------

const COMPONENT_DESCRIPTIONS = {
	Alert: "Persistent notification",
	Avatar: "User/entity representation",
	Badge: "Status/count indicator",
	Breadcrumb: "Hierarchical location",
	Button: "Primary action trigger",
	Card: "Content container",
	Checkbox: "Binary toggle (multiple)",
	CodeBlock: "Code snippet display",
	Container: "Width constraint",
	DataReadout: "Monospace metric display",
	Dialog: "Modal overlay",
	Divider: "Visual separator",
	FormField: "Label + input + hint + error wrapper",
	Grid: "Grid layout primitive",
	Input: "Single-line text entry",
	InstrumentViewport: "Dark instrument panel container",
	Link: "Inline navigation",
	Nav: "Site/app navigation",
	Progress: "Completion indicator",
	Radio: "Single selection from set",
	ScrollReveal: "Scroll-triggered entrance animation",
	Section: "Page section",
	Select: "Option selection",
	Skeleton: "Content placeholder",
	Slider: "Range value selection",
	Spinner: "Loading indicator",
	Stack: "Flex layout primitive",
	Switch: "Binary toggle (single)",
	Table: "Tabular data display",
	Tabs: "Content switching",
	Tag: "Categorization label",
	Textarea: "Multi-line text entry",
	Toast: "Transient notification",
	Tooltip: "Contextual hint",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fileExists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function readFileIfExists(filePath) {
	const absPath = resolve(REPO_ROOT, filePath);
	if (await fileExists(absPath)) {
		return await readFile(absPath, "utf8");
	}
	return null;
}

/** Convert PascalCase to kebab-case */
function toKebab(name) {
	return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Convert PascalCase to Title Case with spaces */
function toTitle(name) {
	return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

function generateLlmsTxt() {
	const lines = [];
	lines.push("# Strand");
	lines.push("> Design tokens + UI components. Zero-runtime CSS. Ship faster.");
	lines.push("");

	const docEntries = PUBLIC_DOCS.filter((d) => d.section === "docs");
	const optionalEntries = PUBLIC_DOCS.filter((d) => d.section === "optional");

	lines.push("## Docs");
	for (const doc of docEntries) {
		lines.push(`- [${doc.name}](${doc.url}): ${doc.purpose}`);
	}
	lines.push("");

	lines.push("## Optional");
	for (const doc of optionalEntries) {
		lines.push(`- [${doc.name}](${doc.url}): ${doc.purpose}`);
	}
	lines.push("");

	return lines.join("\n");
}

async function generateLlmsFullTxt() {
	const sections = [];

	for (const doc of PUBLIC_DOCS) {
		if (!doc.path) continue;
		const content = await readFileIfExists(doc.path);
		if (content === null) continue;
		sections.push(`# ${doc.name}\n\n${content.trim()}`);
	}

	return `${sections.join("\n\n---\n\n")}\n`;
}

async function generateRegistryJson() {
	const manifestPath = join(REPO_ROOT, "parity-manifest.json");
	const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

	const items = manifest.components.map((name) => {
		const kebab = toKebab(name);
		const title = toTitle(name);
		const description = COMPONENT_DESCRIPTIONS[name] || title;

		return {
			name: kebab,
			type: "registry:ui",
			title,
			description,
			files: [{ path: `components/${name}.tsx`, type: "registry:ui" }],
			dependencies: ["@dillingerstaffing/strand"],
			registryDependencies: [],
		};
	});

	return `${JSON.stringify(
		{
			$schema: "https://ui.shadcn.com/schema/registry.json",
			name: "strand",
			homepage: "https://github.com/dillingerstaffing/strand",
			items,
		},
		null,
		2,
	)}\n`;
}

function generateDocmapTable() {
	const lines = [];
	lines.push("| Doc | Purpose |");
	lines.push("|---|---|");
	for (const doc of PUBLIC_DOCS) {
		const link = doc.path
			? `[${doc.name}](${doc.path})`
			: `[${doc.name}](${doc.url})`;
		lines.push(`| ${link} | ${doc.purpose} |`);
	}
	return lines.join("\n");
}

async function updateReadme(componentCount) {
	const readmePath = join(REPO_ROOT, "README.md");
	let readme = await readFile(readmePath, "utf8");

	// Replace DOCMAP section
	const docmap = generateDocmapTable();
	readme = readme.replace(
		/<!-- DOCMAP:START -->[\s\S]*?<!-- DOCMAP:END -->/,
		`<!-- DOCMAP:START -->\n${docmap}\n<!-- DOCMAP:END -->`,
	);

	// Replace COMPONENT-COUNT markers
	readme = readme.replace(
		/<!-- COMPONENT-COUNT:START -->\d+<!-- COMPONENT-COUNT:END -->/g,
		`<!-- COMPONENT-COUNT:START -->${componentCount}<!-- COMPONENT-COUNT:END -->`,
	);

	await writeFile(readmePath, readme, "utf8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	const manifestPath = join(REPO_ROOT, "parity-manifest.json");
	const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
	const componentCount = manifest.components.length;

	// Generate all surfaces
	const llmsTxt = generateLlmsTxt();
	const llmsFullTxt = await generateLlmsFullTxt();
	const registryJson = await generateRegistryJson();

	// Write generated files
	await writeFile(join(REPO_ROOT, "generated/llms.txt"), llmsTxt, "utf8");
	await writeFile(join(REPO_ROOT, "generated/llms-full.txt"), llmsFullTxt, "utf8");
	await writeFile(join(REPO_ROOT, "generated/registry.json"), registryJson, "utf8");

	// Update README markers
	await updateReadme(componentCount);

	console.log("  Agent surfaces generated:");
	console.log(`    llms.txt        (${llmsTxt.length} bytes)`);
	console.log(`    llms-full.txt   (${llmsFullTxt.length} bytes)`);
	console.log(`    registry.json   (${registryJson.length} bytes)`);
	console.log(
		`    README.md       (${componentCount} components, markers updated)`,
	);
}

main().catch((err) => {
	console.error("build-agent-surfaces failed:", err.message);
	console.error(err.stack);
	process.exit(1);
});
