#!/usr/bin/env node
/**
 * measure-bundle.mjs
 *
 * Computes raw + gzipped sizes for every shipped Strand artifact and
 * writes the result into parity-manifest.json under the `bundle` field.
 * Run after `pnpm build` so dist/ artifacts exist.
 *
 * Consumers (e.g., dillinger-staffing's lab marketing page) read
 * `bundle.total_gz_kb` from the published manifest — they do not need
 * to download and measure the files themselves.
 *
 * Usage:
 *   pnpm build && node scripts/measure-bundle.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const ARTIFACTS = [
	["tokens.css", "packages/tokens/css/tokens.css"],
	["reset.css", "packages/tokens/css/reset.css"],
	["base.css", "packages/tokens/css/base.css"],
	["strand-ui.css", "packages/strand-ui/dist/css/strand-ui.css"],
	["strand-ui.js", "packages/strand-ui/dist/vanilla/strand-ui.js"],
];

function measure() {
	const files = {};
	let totalRaw = 0;
	let totalGz = 0;
	for (const [name, rel] of ARTIFACTS) {
		const buf = readFileSync(resolve(REPO_ROOT, rel));
		const gz = gzipSync(buf).length;
		files[name] = { raw_bytes: buf.length, gzipped_bytes: gz };
		totalRaw += buf.length;
		totalGz += gz;
	}
	return {
		files,
		total_raw_bytes: totalRaw,
		total_gz_bytes: totalGz,
		total_gz_kb: Math.round(totalGz / 1024),
	};
}

function main() {
	const manifestPath = resolve(REPO_ROOT, "parity-manifest.json");
	const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
	manifest.bundle = measure();
	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);
	console.log(
		`  ✓ parity-manifest.json bundle.total_gz_kb = ${manifest.bundle.total_gz_kb} (raw=${manifest.bundle.total_raw_bytes} bytes, gz=${manifest.bundle.total_gz_bytes} bytes)`,
	);
}

main();
