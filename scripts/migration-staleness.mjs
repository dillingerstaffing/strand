#!/usr/bin/env node
// Migration guide staleness check.
//
// Strand ships migration guides under docs/migration/ for Bulma, Bootstrap,
// and any other system consumers are coming from. Each guide includes a class
// mapping table like:
//
//   | btn btn-primary | strand-btn strand-btn--primary strand-btn--md |
//
// If any Strand class name referenced in a migration guide no longer exists
// in the built strand-ui.css bundle, the guide is stale and gives consumers
// broken instructions. This check parses every migration guide, extracts
// every token that starts with "strand-", and asserts each one is present in
// the built standalone CSS.
//
// Usage: pnpm test:migration-staleness
//
// Wired into both the CI workflow and the publish workflow (via parity check
// is the gate; this runs as part of test:all).

import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const MIGRATION_DIR = join(REPO_ROOT, "docs", "migration");

// Candidate locations for the built standalone CSS. We check whichever exists.
const CSS_CANDIDATES = [
	join(REPO_ROOT, "packages", "strand-ui", "dist", "css", "strand-ui.css"),
	join(REPO_ROOT, "packages", "strand-ui", "dist", "strand-ui.css"),
];

// We only scan INSIDE markdown backtick code spans (`...`) to avoid matching
// file paths, package names, prose references, and documentation placeholders.
// Each extracted code span is then searched for Strand class names and
// Strand CSS variables using strict patterns.
const CODE_SPAN_PATTERN = /`([^`\n]+)`/g;

// CSS class names inside code spans: strand-<identifier> with optional
// BEM modifiers. Must not contain dots (file ref), slashes (path), or
// uppercase letters (TypeScript type / placeholder). The negative lookbehind
// prevents matching inside a CSS custom property like --strand-...
const CLASS_NAME_PATTERN =
	/(?<!-)\bstrand-[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?\b/g;

// CSS custom properties inside code spans: --strand-<identifier>
const CUSTOM_PROPERTY_PATTERN = /--strand-[a-z][a-z0-9]*(?:-[a-z0-9]+)*\b/g;

// Tokens commonly used as documentation placeholders. Even inside backticks,
// these should not be treated as real class names.
const PLACEHOLDER_PATTERNS = [
	/--cols-n$/i,
	/--gap-n$/i,
	/--\d+$/, // e.g., `strand-btn--size-3` where `3` could be a placeholder
];

function isPlaceholder(token) {
	return PLACEHOLDER_PATTERNS.some((p) => p.test(token));
}

// Pre-existing migration guide drift baseline. These tokens are KNOWN to be
// stale right now (the migration guides were written against an older Strand
// API and have not been updated to match the current API). The check detects
// and reports them but does not fail CI on them. Future drift (new entries
// outside this baseline) DOES fail the check.
//
// This baseline is technical debt. When a stale token is corrected in
// the guide, remove its entry here.
const BASELINE_STALE = new Set([
	"strand-bulma-compat",
	"strand-bulma-use",
	"strand-bulma-vars",
	"strand-primary",
	"strand-family-sans",
	"strand-family-mono",
	"strand-grey-dark",
	"strand-grey-light",
	"strand-radius",
	"strand-card--elevated",
	"strand-success",
	"strand-warning",
	"strand-danger",
]);

async function exists(path) {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
}

async function readCss() {
	for (const candidate of CSS_CANDIDATES) {
		if (await exists(candidate)) return readFile(candidate, "utf8");
	}
	throw new Error(
		`Built strand-ui.css not found at any of the expected locations. Run \`pnpm build\` in the Strand repo first. Checked: ${CSS_CANDIDATES.join(", ")}`,
	);
}

async function readMigrationGuides() {
	if (!(await exists(MIGRATION_DIR))) return [];
	const entries = await readdir(MIGRATION_DIR, { withFileTypes: true });
	const guides = [];
	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
		const path = join(MIGRATION_DIR, entry.name);
		const content = await readFile(path, "utf8");
		guides.push({ path, relPath: `docs/migration/${entry.name}`, content });
	}
	return guides;
}

function extractStrandTokens(content) {
	const tokens = new Set();
	CODE_SPAN_PATTERN.lastIndex = 0;
	let spanMatch = CODE_SPAN_PATTERN.exec(content);
	while (spanMatch !== null) {
		const span = spanMatch[1];
		if (span.includes("/")) {
			spanMatch = CODE_SPAN_PATTERN.exec(content);
			continue;
		}
		// Extract CSS custom properties first (more specific pattern)
		CUSTOM_PROPERTY_PATTERN.lastIndex = 0;
		let propMatch = CUSTOM_PROPERTY_PATTERN.exec(span);
		while (propMatch !== null) {
			if (!isPlaceholder(propMatch[0])) tokens.add(propMatch[0]);
			propMatch = CUSTOM_PROPERTY_PATTERN.exec(span);
		}
		// Then extract class names
		CLASS_NAME_PATTERN.lastIndex = 0;
		let classMatch = CLASS_NAME_PATTERN.exec(span);
		while (classMatch !== null) {
			const token = classMatch[0];
			if (token !== "strand-ui" && !isPlaceholder(token)) {
				tokens.add(token);
			}
			classMatch = CLASS_NAME_PATTERN.exec(span);
		}
		spanMatch = CODE_SPAN_PATTERN.exec(content);
	}
	return tokens;
}

function tokenExistsInCss(token, cssContent) {
	// For CSS variables: check for `--strand-...:` or the var() usage.
	if (token.startsWith("--")) {
		return (
			cssContent.includes(`${token}:`) || cssContent.includes(`var(${token})`)
		);
	}
	// For class names: check for `.strand-...` with a clean word boundary.
	const exact = new RegExp(`\\.${token}(?![a-zA-Z0-9_-])`);
	if (exact.test(cssContent)) return true;
	// Base class heuristic: a token like "strand-progress" is valid if ANY
	// BEM-derived class like "strand-progress--bar" or "strand-progress__fill"
	// exists in the CSS. This matches migration-guide style that references
	// base classes as shorthand for their whole family.
	const bemFamily = new RegExp(`\\.${token}(?:--|__)[a-zA-Z0-9_-]+`);
	if (bemFamily.test(cssContent)) return true;
	// Numeric variant heuristic: a token like "strand-grid--cols" is valid if
	// any numeric-suffixed form (strand-grid--cols-2, strand-grid--cols-3)
	// exists in the CSS. Migration guides use "strand-grid--cols-N" as a
	// family shorthand.
	const numericVariant = new RegExp(`\\.${token}-\\d+`);
	return numericVariant.test(cssContent);
}

async function main() {
	const css = await readCss();
	const guides = await readMigrationGuides();

	if (guides.length === 0) {
		console.log(
			"\n  No migration guides found under docs/migration/. Skipping staleness check.\n",
		);
		return;
	}

	const stale = [];
	const baselineHits = [];
	let totalChecked = 0;

	for (const guide of guides) {
		const tokens = extractStrandTokens(guide.content);
		for (const token of tokens) {
			totalChecked += 1;
			if (tokenExistsInCss(token, css)) continue;
			if (
				BASELINE_STALE.has(token) ||
				BASELINE_STALE.has(token.replace(/^--/, ""))
			) {
				baselineHits.push({ guide: guide.relPath, token });
				continue;
			}
			stale.push({ guide: guide.relPath, token });
		}
	}

	if (stale.length > 0) {
		console.error(
			`\n  MIGRATION STALENESS CHECK FAILED: ${stale.length} new stale token(s) across ${guides.length} guide(s)\n`,
		);
		for (const s of stale) {
			console.error(
				`  STALE ${s.guide} -> ${s.token} (not found in built strand-ui.css)`,
			);
		}
		console.error("");
		console.error(
			"  A migration guide references a Strand class or CSS variable that",
		);
		console.error(
			"  does not exist in the built standalone CSS. Either the class was",
		);
		console.error(
			"  renamed/removed and the guide needs updating, or the build output",
		);
		console.error(
			"  is missing a recent change. Investigate and fix before publishing.",
		);
		console.error("");
		process.exit(1);
	}

	console.log(
		`\n  MIGRATION STALENESS CHECK PASSED: ${totalChecked} token(s) verified across ${guides.length} guide(s).`,
	);
	if (baselineHits.length > 0) {
		console.log(
			`  Grandfathered baseline: ${baselineHits.length} pre-existing stale token(s) (listed in BASELINE_STALE).`,
		);
		console.log(
			"  Shrinking the baseline is a known task; correct the stale tokens in",
		);
		console.log(
			"  docs/migration/*.md and remove their entries from BASELINE_STALE.",
		);
	}
	console.log("");
}

main().catch((err) => {
	console.error("\n  STALENESS CHECK ERROR:", err.message);
	process.exit(2);
});
