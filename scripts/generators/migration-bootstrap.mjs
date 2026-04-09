/**
 * migration-bootstrap.mjs
 *
 * Updates docs/migration/from-bootstrap.md with generated variable
 * mapping table from bootstrap-mappings.json, cross-checked against
 * the actual tokens.css file.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readJSON, replaceMarkerContent } from "./utils.mjs";

/**
 * Extract all CSS custom property names from a tokens.css string.
 * @param {string} css
 * @returns {Set<string>}
 */
export function extractTokenNames(css) {
	const tokens = new Set();
	const pattern = /(--strand-[a-z0-9-]+)\s*:/g;
	let m = pattern.exec(css);
	while (m !== null) {
		tokens.add(m[1]);
		m = pattern.exec(css);
	}
	return tokens;
}

/**
 * Format bootstrap mappings as a markdown table.
 * @param {Array<{bootstrap: string, strand: string}>} mappings
 * @returns {string}
 */
export function formatBootstrapTable(mappings) {
	const lines = [];
	lines.push("| Bootstrap 5 | Strand |");
	lines.push("|---|---|");
	for (const m of mappings) {
		lines.push(`| \`${m.bootstrap}\` | \`${m.strand}\` |`);
	}
	return lines.join("\n");
}

/**
 * Cross-check mappings against tokens.css and return warnings.
 * @param {Array<{bootstrap: string, strand: string}>} mappings
 * @param {Set<string>} tokenNames
 * @returns {string[]}
 */
export function crossCheckTokens(mappings, tokenNames) {
	const warnings = [];
	for (const m of mappings) {
		if (m.strand.startsWith("--strand-") && !tokenNames.has(m.strand)) {
			warnings.push(
				`Bootstrap mapping references "${m.strand}" but it does not exist in tokens.css`,
			);
		}
	}
	return warnings;
}

/**
 * Generate and update docs/migration/from-bootstrap.md.
 */
export async function generateMigrationBootstrap(repoRoot) {
	const filePath = resolve(repoRoot, "docs/migration/from-bootstrap.md");
	let content = await readFile(filePath, "utf8");

	const mappings = await readJSON(
		resolve(repoRoot, "scripts/data/bootstrap-mappings.json"),
	);
	const tokensCss = await readFile(
		resolve(repoRoot, "packages/tokens/css/tokens.css"),
		"utf8",
	);

	const tokenNames = extractTokenNames(tokensCss);
	const warnings = crossCheckTokens(mappings, tokenNames);

	const table = formatBootstrapTable(mappings);

	content = replaceMarkerContent(
		content,
		"<!-- GENERATED:BOOTSTRAP-VARS:START -->",
		"<!-- GENERATED:BOOTSTRAP-VARS:END -->",
		table,
	);

	await writeFile(filePath, content, "utf8");

	for (const w of warnings) {
		process.stderr.write(`WARNING: ${w}\n`);
	}

	return { file: "docs/migration/from-bootstrap.md", warnings };
}
