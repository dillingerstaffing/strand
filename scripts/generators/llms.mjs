/**
 * llms.mjs
 *
 * Generates llms.txt and llms-full.txt from the PUBLIC_DOCS registry.
 * Port from build-agent-surfaces.mjs.
 */

import { access, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

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

async function fileExists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Generate llms.txt content.
 */
export function generateLlmsTxt() {
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

/**
 * Generate llms-full.txt content.
 * @param {string} repoRoot
 */
export async function generateLlmsFullTxt(repoRoot) {
	const sections = [];

	for (const doc of PUBLIC_DOCS) {
		if (!doc.path) continue;
		const absPath = resolve(repoRoot, doc.path);
		if (!(await fileExists(absPath))) continue;
		const content = await readFile(absPath, "utf8");
		sections.push(`# ${doc.name}\n\n${content.trim()}`);
	}

	return `${sections.join("\n\n---\n\n")}\n`;
}

/**
 * Generate and write both llms files.
 */
export async function generateLlms(repoRoot) {
	const llmsTxt = generateLlmsTxt();
	const llmsFullTxt = await generateLlmsFullTxt(repoRoot);

	await writeFile(resolve(repoRoot, "generated/llms.txt"), llmsTxt, "utf8");
	await writeFile(resolve(repoRoot, "generated/llms-full.txt"), llmsFullTxt, "utf8");

	return {
		files: ["generated/llms.txt", "generated/llms-full.txt"],
		sizes: { llms: llmsTxt.length, llmsFull: llmsFullTxt.length },
	};
}
