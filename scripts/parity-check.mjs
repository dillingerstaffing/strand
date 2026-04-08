#!/usr/bin/env node
// Strand cross-consumer parity test.
//
// Reads consumers.json + parity-manifest.json and asserts that every
// consumer type conforms to the canonical API surface. Run via:
//
//   pnpm test:parity
//
// The atomic release workflow (.github/workflows/publish.yml) runs this
// check before any package publishes. Failure aborts the release.
//
// This is the MVP parity contract. It asserts:
//   1. Every publishable package has the same version number (lockstep).
//   2. Every framework consumer package has a directory under src/components/
//      for every component named in parity-manifest.json#/components.
//   3. The packages listed in consumers.json actually exist at the paths
//      declared.
//
// Extensions (prop shape parity, CSS class parity, token parity, Bulma
// mapping parity, migration guide staleness) are future iterations. Adding
// them does not require changing this script's structure; add a new
// assertion function and call it from main().

import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const failures = [];
let assertionCount = 0;

function fail(message) {
	failures.push(message);
}

function assert(condition, message) {
	assertionCount += 1;
	if (!condition) fail(message);
}

async function fileExists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function readJson(relPath) {
	const text = await readFile(join(REPO_ROOT, relPath), "utf8");
	return JSON.parse(text);
}

async function assertLockstepVersions(consumers) {
	const publishable = consumers.consumers.filter((c) => c.publishable);
	const versionsByPackage = new Map();

	for (const c of publishable) {
		const pkgPath = join(REPO_ROOT, c.packagePath, "package.json");
		const exists = await fileExists(pkgPath);
		assert(
			exists,
			`Consumer "${c.id}": package.json missing at ${c.packagePath}`,
		);
		if (!exists) continue;
		const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
		versionsByPackage.set(c.id, pkg.version);
	}

	const versions = [...new Set(versionsByPackage.values())];
	assert(
		versions.length === 1,
		`Lockstep version violation: publishable packages are at ${[
			...versionsByPackage.entries(),
		]
			.map(([id, v]) => `${id}@${v}`)
			.join(", ")}. All publishable packages must share the same version.`,
	);
}

async function assertFrameworkComponentParity(consumers, manifest) {
	const frameworkConsumers = consumers.consumers.filter(
		(c) => c.parity?.type === "framework-components" && !c.sharedWith,
	);

	for (const c of frameworkConsumers) {
		const componentsDir = join(REPO_ROOT, c.packagePath, "src", "components");
		const dirExists = await fileExists(componentsDir);
		assert(
			dirExists,
			`Consumer "${c.id}": components directory missing at ${c.packagePath}/src/components`,
		);
		if (!dirExists) continue;

		const entries = await readdir(componentsDir, { withFileTypes: true });
		const dirs = new Set(
			entries.filter((e) => e.isDirectory()).map((e) => e.name),
		);

		for (const expected of manifest.components) {
			assert(
				dirs.has(expected),
				`Consumer "${c.id}": component "${expected}" missing from ${c.packagePath}/src/components (required by parity-manifest.json)`,
			);
		}
	}
}

async function assertPackagePathsExist(consumers) {
	for (const c of consumers.consumers) {
		if (!c.packagePath) continue;
		const path = join(REPO_ROOT, c.packagePath);
		const exists = await fileExists(path);
		assert(
			exists,
			`Consumer "${c.id}": declared packagePath ${c.packagePath} does not exist`,
		);
	}
}

async function main() {
	const consumers = await readJson("consumers.json");
	const manifest = await readJson("parity-manifest.json");

	await assertPackagePathsExist(consumers);
	await assertLockstepVersions(consumers);
	await assertFrameworkComponentParity(consumers, manifest);

	if (failures.length > 0) {
		console.error(
			`\n  PARITY CHECK FAILED (${failures.length} of ${assertionCount} assertions)\n`,
		);
		for (const f of failures) console.error(`  FAIL ${f}`);
		console.error("");
		process.exit(1);
	}

	console.log(`\n  PARITY CHECK PASSED (${assertionCount} assertions)\n`);
	console.log(`  Consumer types: ${consumers.consumers.length}`);
	console.log(`  Canonical components: ${manifest.components.length}`);
	console.log(`  Manifest version: ${manifest.version}`);
	console.log("");
}

main().catch((err) => {
	console.error("\n  PARITY CHECK ERROR:", err.message);
	console.error(err.stack);
	process.exit(2);
});
