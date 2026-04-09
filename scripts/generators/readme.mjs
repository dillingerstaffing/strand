/**
 * readme.mjs
 *
 * Updates README.md DOCMAP and COMPONENT-COUNT markers.
 * Port from build-agent-surfaces.mjs.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readJSON } from "./utils.mjs";

const PUBLIC_DOCS = [
	{
		name: "README",
		path: "./README.md",
		purpose: "Install, configure, start building",
		url: "https://github.com/dillingerstaffing/strand/blob/main/README.md",
	},
	{
		name: "AGENTS.md",
		path: "./AGENTS.md",
		purpose: "AI coding agent usage instructions",
		url: "https://github.com/dillingerstaffing/strand/blob/main/AGENTS.md",
	},
	{
		name: "HTML Reference",
		path: "./HTML_REFERENCE.md",
		purpose: "CSS class API for every component",
		url: "https://github.com/dillingerstaffing/strand/blob/main/HTML_REFERENCE.md",
	},
	{
		name: "Design Language",
		path: "./DESIGN_LANGUAGE.md",
		purpose: "Complete design specification",
		url: "https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md",
	},
	{
		name: "Consumers",
		path: "./CONSUMERS.md",
		purpose: "Consumer types and framework parity",
		url: "https://github.com/dillingerstaffing/strand/blob/main/CONSUMERS.md",
	},
	{
		name: "Changelog",
		path: "./CHANGELOG.md",
		purpose: "Version history",
		url: "https://github.com/dillingerstaffing/strand/blob/main/CHANGELOG.md",
	},
	{
		name: "Contributing",
		path: "./CONTRIBUTING.md",
		purpose: "How to contribute",
		url: "https://github.com/dillingerstaffing/strand/blob/main/CONTRIBUTING.md",
	},
	{
		name: "Bulma Migration",
		path: "./docs/migration/from-bulma.md",
		purpose: "Use Strand alongside Bulma",
		url: "https://github.com/dillingerstaffing/strand/blob/main/docs/migration/from-bulma.md",
	},
	{
		name: "Bootstrap Migration",
		path: "./docs/migration/from-bootstrap.md",
		purpose: "Use Strand alongside Bootstrap",
		url: "https://github.com/dillingerstaffing/strand/blob/main/docs/migration/from-bootstrap.md",
	},
	{
		name: "Strand Lab Page",
		path: null,
		purpose: "Live showcase and brand entry point",
		url: "https://dillingerstaffing.com/labs/strand",
	},
];

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

/**
 * Generate and update README.md markers.
 */
export async function generateReadme(repoRoot) {
	const manifest = await readJSON(resolve(repoRoot, "parity-manifest.json"));
	const componentCount = manifest.components.length;

	const readmePath = resolve(repoRoot, "README.md");
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
	return { file: "README.md", componentCount };
}
