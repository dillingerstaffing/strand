#!/usr/bin/env node
// Syncs every publishable consumer package's version to the root package.json
// version. Usage:
//
//   pnpm sync-versions                 bumps every sub-package to match root
//   node scripts/sync-versions.mjs --check  verifies all are in sync, exits
//                                           non-zero if any drift
//
// The parity check (scripts/parity-check.mjs) enforces lockstep version as a
// gate. This script is the tool that applies the lockstep. The normal flow is:
//
//   1. Edit root package.json "version" to the new version
//   2. Run `pnpm sync-versions`
//   3. Commit, push to main
//   4. The publish workflow picks up the changes and publishes atomically

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const CHECK_ONLY = process.argv.includes("--check");

async function readJson(path) {
	return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, data) {
	await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
	const consumers = await readJson(join(REPO_ROOT, "consumers.json"));
	const rootPkg = await readJson(join(REPO_ROOT, "package.json"));
	const target = rootPkg.version;

	const publishable = consumers.consumers.filter((c) => c.publishable);
	const drift = [];
	const synced = [];

	for (const c of publishable) {
		const pkgPath = join(REPO_ROOT, c.packagePath, "package.json");
		const pkg = await readJson(pkgPath);

		if (pkg.version === target) {
			synced.push(`${c.id}@${pkg.version}`);
			continue;
		}

		if (CHECK_ONLY) {
			drift.push(`${c.id}: ${pkg.version} (expected ${target})`);
			continue;
		}

		pkg.version = target;
		await writeJson(pkgPath, pkg);
		console.log(`  synced ${c.id}: -> ${target}`);
	}

	if (CHECK_ONLY) {
		if (drift.length > 0) {
			console.error("\n  SYNC CHECK FAILED\n");
			console.error(`  Root package.json version: ${target}`);
			for (const d of drift) console.error(`  DRIFT ${d}`);
			console.error("");
			process.exit(1);
		}
		console.log(
			`\n  SYNC CHECK PASSED (${synced.length} packages at ${target})\n`,
		);
		return;
	}

	const parityManifest = await readJson(
		join(REPO_ROOT, "parity-manifest.json"),
	);
	if (parityManifest.version !== target) {
		parityManifest.version = target;
		await writeJson(join(REPO_ROOT, "parity-manifest.json"), parityManifest);
		console.log(`  synced parity-manifest.json: -> ${target}`);
	}

	console.log(
		`\n  SYNC COMPLETE: all publishable packages + manifest at ${target}\n`,
	);
}

main().catch((err) => {
	console.error("SYNC ERROR:", err.message);
	process.exit(2);
});
