#!/usr/bin/env node
// Dogfood audit: scans a showcase source tree for any forbidden terms,
// configured by the operator via a local, gitignored terms file. If any
// match is found, the audit fails and the showcase iteration is invalid.
//
// This is the post-hoc enforcement backstop for the Consumer Agent isolation
// invariant. If a human copy-pasted something they should not have, or the
// agent somehow reached context it should not have, this scan catches it.
//
// Configuration:
//   The forbidden term list is NOT hardcoded in this file and is NOT committed
//   to the repository. Operators maintain a local file
//   `.dogfood-forbidden.json` at the repository root (gitignored) containing
//   an array of strings. Example:
//
//     [
//       "INTERNAL_TERM_ONE",
//       "INTERNAL_TERM_TWO",
//       "some-private-path"
//     ]
//
//   If `.dogfood-forbidden.json` is missing the audit ABORTS with a clear
//   message. The audit never silently passes without a configured list,
//   because a silent pass would give a false sense of safety.
//
// Usage:
//   pnpm audit-dogfood pricing-page
//   node scripts/dogfood-audit.mjs pricing-page

import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const name = process.argv[2];
if (!name) {
	console.error("\n  USAGE: pnpm audit-dogfood <name>\n");
	process.exit(1);
}

const SKIP_DIRS = new Set(["node_modules", "dist", ".vite", ".git"]);
// Files written by the scaffold itself, not by the Consumer Agent.
const SKIP_FILES = new Set([".dogfood-launch.md"]);
const SCAN_EXTENSIONS = new Set([
	".ts",
	".tsx",
	".js",
	".jsx",
	".css",
	".scss",
	".html",
	".md",
	".json",
]);

async function loadForbiddenTerms() {
	const configPath = join(REPO_ROOT, ".dogfood-forbidden.json");
	try {
		const content = await readFile(configPath, "utf8");
		const parsed = JSON.parse(content);
		if (!Array.isArray(parsed)) {
			throw new Error(".dogfood-forbidden.json must be a JSON array of strings");
		}
		const terms = parsed.filter((t) => typeof t === "string" && t.length > 0);
		if (terms.length === 0) {
			throw new Error(".dogfood-forbidden.json must contain at least one term");
		}
		return terms;
	} catch (err) {
		if (err && err.code === "ENOENT") {
			console.error(
				"\n  ABORT: .dogfood-forbidden.json not found at repository root.",
			);
			console.error(
				"  The audit requires a configured list of terms to check for.",
			);
			console.error(
				"  Create a gitignored file at the repo root containing an array",
			);
			console.error(
				"  of strings. The file is excluded from version control and must",
			);
			console.error("  never be committed.\n");
			console.error("  Example:");
			console.error("    [");
			console.error('      "INTERNAL_TERM_ONE",');
			console.error('      "some-private-path"');
			console.error("    ]\n");
			process.exit(1);
		}
		console.error(`\n  ABORT: ${err.message || err}\n`);
		process.exit(1);
	}
}

const findings = [];

async function scanDir(dir, relTo, forbiddenTerms) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const full = join(dir, entry.name);
		const rel = full.slice(relTo.length + 1);
		if (entry.isDirectory()) {
			await scanDir(full, relTo, forbiddenTerms);
			continue;
		}
		if (SKIP_FILES.has(entry.name)) continue;
		const dot = entry.name.lastIndexOf(".");
		if (dot === -1) continue;
		const ext = entry.name.slice(dot);
		if (!SCAN_EXTENSIONS.has(ext)) continue;

		const content = await readFile(full, "utf8");
		const lowerContent = content.toLowerCase();
		for (const term of forbiddenTerms) {
			const lowerTerm = term.toLowerCase();
			if (lowerContent.includes(lowerTerm)) {
				const lines = content.split("\n");
				const lineIndex = lines.findIndex((l) =>
					l.toLowerCase().includes(lowerTerm),
				);
				findings.push({
					file: rel,
					term,
					line: lineIndex >= 0 ? lineIndex + 1 : null,
					snippet:
						lineIndex >= 0 ? lines[lineIndex].trim().slice(0, 120) : null,
				});
			}
		}
	}
}

async function main() {
	const forbiddenTerms = await loadForbiddenTerms();

	const showcaseDir = join(REPO_ROOT, "packages", "strand-examples", name);
	try {
		await stat(showcaseDir);
	} catch {
		console.error(`\n  ABORT: ${showcaseDir} does not exist.`);
		console.error(
			"  Run `pnpm dogfood <name>` first to scaffold the showcase.\n",
		);
		process.exit(1);
	}

	await scanDir(showcaseDir, showcaseDir, forbiddenTerms);

	if (findings.length > 0) {
		console.error(
			`\n  DOGFOOD AUDIT FAILED: ${findings.length} forbidden term reference(s) found in showcase "${name}"\n`,
		);
		for (const f of findings) {
			console.error(
				`  LEAK ${f.file}${f.line ? `:${f.line}` : ""} -> ${f.term}`,
			);
			if (f.snippet) console.error(`       ${f.snippet}`);
		}
		console.error("");
		console.error(
			"  The showcase iteration is INVALID. The forbidden terms came from",
		);
		console.error(
			"  somewhere they should not have. Either the Consumer Agent read",
		);
		console.error(
			"  files it should not have, or a human copy-pasted something they",
		);
		console.error(
			"  should not have. Remove the references before the showcase can",
		);
		console.error("  graduate.\n");
		process.exit(1);
	}

	console.log(
		`\n  DOGFOOD AUDIT PASSED: showcase "${name}" contains zero references from the configured forbidden list (${forbiddenTerms.length} terms).\n`,
	);
}

main().catch((err) => {
	console.error("\n  AUDIT ERROR:", err.message);
	console.error(err.stack);
	process.exit(2);
});
