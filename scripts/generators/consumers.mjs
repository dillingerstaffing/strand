/**
 * consumers.mjs
 *
 * Generates CONSUMERS.md from consumers.json. Every fact comes from the
 * machine-readable data; no hand-authored content needed.
 */

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readJSON } from "./utils.mjs";

/**
 * Generate CONSUMERS.md content from consumers.json data.
 * @param {object} data - parsed consumers.json
 * @returns {string}
 */
export function generateConsumersMarkdown(data) {
	const lines = [];

	lines.push("# Strand Consumer Types");
	lines.push("");
	lines.push(
		"Strand ships a single design language through multiple consumer-type surfaces so developers can adopt it without changing their stack. Every consumer type below is kept in **strict parity**: the same component inventory, the same token system, the same version number, in the same release. A primitive added to one consumer type is added to every consumer type in the same PR.",
	);
	lines.push("");
	lines.push(
		"This file is the **single source of truth** for which consumer types Strand supports. The machine-readable companion `consumers.json` powers the parity test and the atomic release workflow. To add a new consumer type, add an entry to `consumers.json`, add a block to this file, and build the package to parity with the existing consumer types.",
	);
	lines.push("");
	lines.push("---");
	lines.push("");

	for (let i = 0; i < data.consumers.length; i++) {
		const c = data.consumers[i];
		lines.push(`## ${i + 1}. ${c.name}`);
		lines.push("");

		// Description based on kind
		if (c.kind === "package") {
			lines.push(
				`Install the \`${c.packageName}\` package to use ${c.name} components.`,
			);
		} else if (c.kind === "sub-export") {
			if (c.sharedWith) {
				lines.push(
					`Shares the same package as ${c.sharedWith}${c.id === "react" ? " via preact/compat aliasing at the bundler level" : ""}.`,
				);
			}
		} else if (c.kind === "coexistence-layer") {
			lines.push(
				`Coexistence layer: use ${c.name} alongside your existing CSS framework.`,
			);
		} else if (c.kind === "coexistence-guide") {
			lines.push(
				`Coexistence guide: ${c.name} coexists via class-prefix naming convention.`,
			);
		}
		lines.push("");

		// Install command
		if (c.install && !c.install.startsWith("see ")) {
			lines.push("```bash");
			lines.push(c.install);
			lines.push("```");
			lines.push("");
		} else if (c.install && c.install.startsWith("see ")) {
			lines.push(`Install: ${c.install}`);
			lines.push("");
		}

		// Package info
		if (c.packagePath) {
			lines.push(`Package: \`${c.packagePath}/\``);
		}
		if (c.artifactPath) {
			lines.push(`Artifact: \`${c.artifactPath}\``);
		}
		if (c.artifactPaths) {
			lines.push(
				`Artifacts: ${c.artifactPaths.map((p) => `\`${p}\``).join(", ")}`,
			);
		}
		if (c.migrationGuide) {
			lines.push(`Migration guide: [${c.migrationGuide}](./${c.migrationGuide})`);
		}

		// Parity obligation
		lines.push(`Parity obligation: ${c.parity.assertion}`);
		lines.push("");
		lines.push("---");
		lines.push("");
	}

	// Adding a new consumer type
	lines.push("## Adding a new consumer type");
	lines.push("");
	lines.push(
		"1. Add an entry to `consumers.json` with a stable `id`, display `name`, `kind` (`package` | `sub-export` | `coexistence-layer`), path, install instructions, and parity obligation.",
	);
	lines.push(
		"2. Add a block to this file (`CONSUMERS.md`) describing the new type for human readers.",
	);
	lines.push(
		"3. Build the package to parity: every primitive listed in `parity-manifest.json` must be reachable through the new consumer type.",
	);
	lines.push(
		"4. The parity test picks up the new consumer type automatically from `consumers.json`. No tooling changes needed.",
	);
	lines.push(
		"5. The release workflow publishes the new package on the next root version bump.",
	);
	lines.push("");
	lines.push(
		"Every consumer type shares one invariant: the same design language reaches every developer, regardless of their stack. The library is the brand argument. Parity is how it holds.",
	);
	lines.push("");

	return lines.join("\n");
}

/**
 * Generate and write CONSUMERS.md.
 */
export async function generateConsumers(repoRoot) {
	const data = await readJSON(resolve(repoRoot, "consumers.json"));
	const content = generateConsumersMarkdown(data);
	await writeFile(resolve(repoRoot, "CONSUMERS.md"), content, "utf8");
	return { file: "CONSUMERS.md" };
}
