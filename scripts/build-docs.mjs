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

	// TWO PHASES, and the split is load-bearing rather than tidy.
	//
	// These nine were one `Promise.allSettled`, so they all ran concurrently.
	// But three of them CONSUME what the others write: generateLlms builds
	// llms-full.txt by reading every file in PUBLIC_DOCS off disk, which
	// includes generated/html-reference.md and both migration guides, and
	// registry and readme read from disk too. Concurrently with the writers.
	//
	// So llms-full.txt was assembled from whatever happened to be on disk at
	// read time, which is the PREVIOUS run's content. Measured: adding the
	// Settle primitive and running `pnpm build:docs` once left
	// generated/llms-full.txt with zero mentions of `strand-settle` while
	// generated/html-reference.md had four. Running the same command a second
	// time, changing nothing else, brought llms-full.txt to four.
	//
	// It is a race rather than a fixed ordering, so it did not fail every
	// time and it never failed loudly. This is the mechanism behind two
	// releases' worth of "the agent surfaces are stale" cleanups: 0.32.1
	// shipped the CSS-only and Bootstrap class docs that 0.32.0 missed, and a
	// later commit regenerated the surfaces Reserve had left behind. Both were
	// treated as someone forgetting a step. Nobody forgot; the build was
	// nondeterministic.
	//
	// Phase 1 writes. Phase 2 reads what phase 1 wrote. Parallelism inside
	// each phase is retained because those generators are genuinely
	// independent.
	const producers = await Promise.allSettled([
		generateHtmlReference(REPO_ROOT),
		generateChangelog(REPO_ROOT),
		generateConsumers(REPO_ROOT),
		generateContributing(REPO_ROOT),
		generateMigrationBulma(REPO_ROOT),
		generateMigrationBootstrap(REPO_ROOT),
	]);
	const consumers = await Promise.allSettled([
		generateLlms(REPO_ROOT),
		generateRegistry(REPO_ROOT),
		generateReadme(REPO_ROOT),
	]);
	const results = [...producers, ...consumers];

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
