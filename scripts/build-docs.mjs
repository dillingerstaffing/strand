#!/usr/bin/env node
/**
 * build-docs.mjs
 *
 * Generates ALL public documentation from source code. One command
 * regenerates every public doc. Zero manual sync. Zero drift.
 *
 * Run via:
 *   node scripts/build-docs.mjs
 *   pnpm build:docs
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { generateChangelog } from "./generators/changelog.mjs";
import { generateConsumers } from "./generators/consumers.mjs";
import { generateContributing } from "./generators/contributing.mjs";
import { generateHtmlReference } from "./generators/html-reference.mjs";
import { generateLlms } from "./generators/llms.mjs";
import { generateMigrationBootstrap } from "./generators/migration-bootstrap.mjs";
import { generateMigrationBulma } from "./generators/migration-bulma.mjs";
import { generateReadme } from "./generators/readme.mjs";
import { generateRegistry } from "./generators/registry.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

async function main() {
	console.log("Building documentation from source...\n");

	const results = await Promise.allSettled([
		generateHtmlReference(REPO_ROOT),
		generateChangelog(REPO_ROOT),
		generateConsumers(REPO_ROOT),
		generateContributing(REPO_ROOT),
		generateMigrationBulma(REPO_ROOT),
		generateMigrationBootstrap(REPO_ROOT),
		generateLlms(REPO_ROOT),
		generateRegistry(REPO_ROOT),
		generateReadme(REPO_ROOT),
	]);

	const names = [
		"HTML Reference",
		"Changelog",
		"Consumers",
		"Contributing",
		"Migration (Bulma)",
		"Migration (Bootstrap)",
		"LLMs",
		"Registry",
		"README",
	];

	let hasErrors = false;

	console.log("  Results:");
	for (let i = 0; i < results.length; i++) {
		const r = results[i];
		if (r.status === "fulfilled") {
			const val = r.value;
			const files = val.files
				? val.files.join(", ")
				: val.file;
			console.log(`    [ok] ${names[i]}: ${files}`);
		} else {
			hasErrors = true;
			console.error(`    [FAIL] ${names[i]}: ${r.reason.message}`);
		}
	}

	console.log("");

	if (hasErrors) {
		console.error("Some generators failed. See errors above.");
		process.exit(1);
	}

	console.log("All documentation generated successfully.");
}

main().catch((err) => {
	console.error("build-docs failed:", err.message);
	console.error(err.stack);
	process.exit(1);
});
