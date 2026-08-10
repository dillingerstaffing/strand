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

// The `/*! ... */` banner at the top of each shipped stylesheet is the version
// a consumer sees when they open the file, and the one downstream tooling
// reads. Nothing kept them current, so they froze at whatever release first
// wrote them: v0.5.0 and v0.2.0 on a 0.27.0 package. The version group is
// optional so a banner that never carried one gets it added rather than skipped.
export const BANNER_RE =
	/(\/\*! Strand(?: UI| fonts)?) (?:v\d+\.\d+\.\d+ )?(\| MIT License)/;

// Files whose banner is part of the published artifact. fonts.css is generated,
// but is stamped here too so a version bump alone keeps it truthful without
// needing a network round trip to regenerate it.
const BANNER_FILES = [
	"packages/tokens/css/tokens.css",
	"packages/tokens/css/reset.css",
	"packages/tokens/css/base.css",
	"packages/tokens/css/fonts.css",
	// The standalone bundle's banner is a string literal in the build config,
	// prepended to the concatenated CSS at build time.
	"packages/strand-ui/vite.config.ts",
];

/**
 * Rewrites the version in the first Strand banner, leaving everything else
 * alone. Only the first match is replaced, so a concatenated bundle keeps a
 * single header, and a version mentioned in prose further down is untouched.
 *
 * @param {string} content
 * @param {string} version
 */
export function stampBanner(content, version) {
	return content.replace(BANNER_RE, `$1 v${version} $2`);
}

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

	for (const rel of BANNER_FILES) {
		const path = join(REPO_ROOT, rel);
		let content;
		try {
			content = await readFile(path, "utf8");
		} catch {
			continue;
		}
		const stamped = stampBanner(content, target);
		if (stamped === content) continue;

		if (CHECK_ONLY) {
			drift.push(`${rel}: banner is not at ${target}`);
			continue;
		}
		await writeFile(path, stamped, "utf8");
		console.log(`  stamped ${rel}: -> ${target}`);
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

// Only run when invoked directly, so the banner helpers stay importable from
// tests without the sync executing as an import side effect.
if (
	process.argv[1] &&
	resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
) {
	main().catch((err) => {
		console.error("SYNC ERROR:", err.message);
		process.exit(2);
	});
}
