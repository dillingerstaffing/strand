/**
 * migration-bulma.mjs
 *
 * Updates docs/migration/from-bulma.md with generated variable mapping
 * tables parsed from the actual compat CSS and Sass source files.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { replaceMarkerContent } from "./utils.mjs";

/**
 * Parse CSS variable declarations from strand-bulma-compat.css.
 * Returns an array of { bulma, strand } mappings.
 * @param {string} css
 * @returns {Array<{bulma: string, strand: string}>}
 */
export function parseBulmaCompatCSS(css) {
	const mappings = [];
	// Match --bulma-*: var(--strand-*) or --bulma-*: <value>
	const pattern = /(--bulma-[a-z0-9-]+)\s*:\s*(.+?)\s*;/g;
	let m = pattern.exec(css);
	while (m !== null) {
		const bulma = m[1];
		const value = m[2];
		// Check if it references a strand token
		const strandRef = value.match(/var\((--strand-[a-z0-9-]+)/);
		const strand = strandRef ? strandRef[1] : value;
		mappings.push({ bulma, strand });
		m = pattern.exec(css);
	}
	return mappings;
}

/**
 * Parse Sass variable declarations from _strand-bulma-vars.scss.
 * Returns an array of { sass, value, strandComment } mappings.
 * @param {string} scss
 * @returns {Array<{sass: string, value: string, comment: string}>}
 */
export function parseBulmaSassVars(scss) {
	const mappings = [];
	const pattern = /(\$[a-z0-9-]+)\s*:\s*(.+?)\s*;\s*(\/\/\s*(.+))?$/gm;
	let m = pattern.exec(scss);
	while (m !== null) {
		mappings.push({
			sass: m[1],
			value: m[2].trim(),
			comment: m[4] ? m[4].trim() : "",
		});
		m = pattern.exec(scss);
	}
	return mappings;
}

/**
 * Format CSS variable mappings as a markdown table.
 */
export function formatCSSVarsTable(mappings) {
	const lines = [];
	lines.push("| Bulma Variable | Strand Token |");
	lines.push("|---|---|");
	for (const m of mappings) {
		const strandDisplay = m.strand.startsWith("--strand-")
			? `\`var(${m.strand})\``
			: `\`${m.strand}\``;
		lines.push(`| \`${m.bulma}\` | ${strandDisplay} |`);
	}
	return lines.join("\n");
}

/**
 * Format Sass variable mappings as a markdown table.
 */
export function formatSassVarsTable(mappings) {
	const lines = [];
	lines.push("| Sass Variable | Value | Maps To |");
	lines.push("|---|---|---|");
	for (const m of mappings) {
		lines.push(`| \`${m.sass}\` | \`${m.value}\` | ${m.comment} |`);
	}
	return lines.join("\n");
}

/**
 * Generate and update docs/migration/from-bulma.md.
 */
export async function generateMigrationBulma(repoRoot) {
	const filePath = resolve(repoRoot, "docs/migration/from-bulma.md");
	let content = await readFile(filePath, "utf8");

	// Parse source files
	const compatCSS = await readFile(
		resolve(repoRoot, "packages/tokens/bulma/strand-bulma-compat.css"),
		"utf8",
	);
	const sassVars = await readFile(
		resolve(repoRoot, "packages/tokens/bulma/_strand-bulma-vars.scss"),
		"utf8",
	);

	const cssVars = parseBulmaCompatCSS(compatCSS);
	const sassEntries = parseBulmaSassVars(sassVars);

	const cssTable = formatCSSVarsTable(cssVars);
	const sassTable = formatSassVarsTable(sassEntries);

	content = replaceMarkerContent(
		content,
		"<!-- GENERATED:BULMA-CSS-VARS:START -->",
		"<!-- GENERATED:BULMA-CSS-VARS:END -->",
		cssTable,
	);

	content = replaceMarkerContent(
		content,
		"<!-- GENERATED:BULMA-SASS-VARS:START -->",
		"<!-- GENERATED:BULMA-SASS-VARS:END -->",
		sassTable,
	);

	await writeFile(filePath, content, "utf8");
	return { file: "docs/migration/from-bulma.md" };
}
