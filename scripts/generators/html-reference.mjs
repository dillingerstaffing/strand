/**
 * html-reference.mjs
 *
 * Generates the component reference section of HTML_REFERENCE.md.
 * Reads CSS inventory + class-docs.json, outputs markdown tables for
 * every component with descriptions, classes, and usage examples.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildInventory } from "./css-inventory.mjs";
import { readJSON, replaceMarkerContent } from "./utils.mjs";

/**
 * Generate the component reference markdown.
 * @param {Map} inventory - CSS class inventory from css-inventory.mjs
 * @param {object} classDocs - parsed class-docs.json
 * @param {string} version - package version for CDN URLs
 * @returns {{ markdown: string, warnings: string[] }}
 */
export function generateComponentMarkdown(inventory, classDocs, version) {
	const warnings = [];
	const sections = [];

	// Build a set of all classes that exist in CSS
	const allCssClasses = new Set();
	for (const [, group] of inventory) {
		for (const cls of group.classes) {
			allCssClasses.add(cls.name);
		}
	}

	// Process documented components
	for (const comp of classDocs.components) {
		const lines = [];
		lines.push(`### ${comp.name}`);
		lines.push("");
		lines.push(comp.description);
		lines.push("");

		// Class table
		lines.push("| Class | Type | Description |");
		lines.push("|---|---|---|");

		for (const cls of comp.classes) {
			const exists = allCssClasses.has(cls.class);
			if (!exists) {
				warnings.push(
					`class-docs.json references "${cls.class}" (${comp.name}) but it does not exist in CSS`,
				);
			}
			const type = cls.class.includes("__")
				? "child"
				: cls.class.includes("--")
					? "modifier"
					: "base";
			lines.push(
				`| \`${cls.class}\` | ${type} | ${cls.description} |`,
			);
		}

		// Find classes in CSS but not in class-docs.json for this component
		const docClassNames = new Set(comp.classes.map((c) => c.class));
		const inventoryGroup = inventory.get(comp.name);
		if (inventoryGroup) {
			for (const cls of inventoryGroup.classes) {
				if (!docClassNames.has(cls.name)) {
					lines.push(`| \`${cls.name}\` | ${cls.type} | |`);
				}
			}
		}

		lines.push("");

		// Usage example
		if (comp.example) {
			lines.push("**Usage:**");
			lines.push("");
			lines.push("```html");
			lines.push(comp.example);
			lines.push("```");
			lines.push("");
		}

		lines.push("---");
		lines.push("");
		sections.push(lines.join("\n"));
	}

	// Process Global classes
	if (classDocs.global) {
		const lines = [];
		lines.push("### Global (Utilities, Molecules, Typography)");
		lines.push("");
		lines.push(classDocs.global.description);
		lines.push("");
		lines.push("| Class | Description |");
		lines.push("|---|---|");

		const docClassNames = new Set(
			classDocs.global.classes.map((c) => c.class),
		);

		for (const cls of classDocs.global.classes) {
			if (!allCssClasses.has(cls.class)) {
				warnings.push(
					`class-docs.json references "${cls.class}" (Global) but it does not exist in CSS`,
				);
			}
			lines.push(`| \`${cls.class}\` | ${cls.description} |`);
		}

		// Find undocumented global classes
		const globalGroup = inventory.get("Global");
		if (globalGroup) {
			for (const cls of globalGroup.classes) {
				if (!docClassNames.has(cls.name)) {
					lines.push(`| \`${cls.name}\` | |`);
				}
			}
		}

		lines.push("");
		sections.push(lines.join("\n"));
	}

	// Check for classes in class-docs.json that reference classes not in CSS
	// (already handled per-component above)

	return { markdown: sections.join("\n"), warnings };
}

/**
 * Generate and write the HTML_REFERENCE.md file.
 * @param {string} repoRoot - absolute path to repo root
 */
export async function generateHtmlReference(repoRoot) {
	const inventory = await buildInventory(repoRoot);
	const classDocs = await readJSON(
		resolve(repoRoot, "scripts/data/class-docs.json"),
	);
	const tokensPkg = await readJSON(
		resolve(repoRoot, "packages/tokens/package.json"),
	);
	const version = tokensPkg.version;

	const { markdown, warnings } = generateComponentMarkdown(
		inventory,
		classDocs,
		version,
	);

	// Read current HTML_REFERENCE.md
	const refPath = resolve(repoRoot, "HTML_REFERENCE.md");
	let content = await readFile(refPath, "utf8");

	// Replace content between markers
	content = replaceMarkerContent(
		content,
		"<!-- GENERATED:COMPONENT-REFERENCE:START -->",
		"<!-- GENERATED:COMPONENT-REFERENCE:END -->",
		markdown,
	);

	await writeFile(refPath, content, "utf8");

	// Print warnings to stderr
	for (const w of warnings) {
		process.stderr.write(`WARNING: ${w}\n`);
	}

	return { file: "HTML_REFERENCE.md", warnings };
}
