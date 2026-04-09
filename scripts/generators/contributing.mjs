// contributing.mjs
//
// Updates CONTRIBUTING.md with generated project structure and commands
// sections sourced from each workspace's config and root config.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { readJSON, replaceMarkerContent } from "./utils.mjs";

/**
 * Generate the project structure table from packages.
 * @param {string} repoRoot
 * @returns {Promise<string>}
 */
export async function generateProjectStructure(repoRoot) {
	const packagesDir = resolve(repoRoot, "packages");
	const entries = await readdir(packagesDir, { withFileTypes: true });
	const lines = [];

	lines.push("| Directory | Package | Description |");
	lines.push("|---|---|---|");

	for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
		if (!entry.isDirectory()) continue;
		const pkgPath = join(packagesDir, entry.name, "package.json");
		try {
			const pkg = await readJSON(pkgPath);
			lines.push(
				`| \`packages/${entry.name}/\` | \`${pkg.name}\` | ${pkg.description || "No description"} |`,
			);
		} catch {
			lines.push(`| \`packages/${entry.name}/\` | | |`);
		}
	}

	return lines.join("\n");
}

/**
 * Generate the commands table from root package.json scripts.
 * @param {string} repoRoot
 * @returns {Promise<string>}
 */
export async function generateCommands(repoRoot) {
	const pkg = await readJSON(resolve(repoRoot, "package.json"));
	const lines = [];

	lines.push("| Command | Script |");
	lines.push("|---|---|");

	const scripts = pkg.scripts || {};
	for (const [name, script] of Object.entries(scripts).sort()) {
		lines.push(`| \`pnpm ${name}\` | \`${script}\` |`);
	}

	return lines.join("\n");
}

/**
 * Generate and update CONTRIBUTING.md.
 */
export async function generateContributing(repoRoot) {
	const filePath = resolve(repoRoot, "CONTRIBUTING.md");
	let content = await readFile(filePath, "utf8");

	const structure = await generateProjectStructure(repoRoot);
	const commands = await generateCommands(repoRoot);

	content = replaceMarkerContent(
		content,
		"<!-- GENERATED:PROJECT-STRUCTURE:START -->",
		"<!-- GENERATED:PROJECT-STRUCTURE:END -->",
		structure,
	);

	content = replaceMarkerContent(
		content,
		"<!-- GENERATED:COMMANDS:START -->",
		"<!-- GENERATED:COMMANDS:END -->",
		commands,
	);

	await writeFile(filePath, content, "utf8");
	return { file: "CONTRIBUTING.md" };
}
