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
// rejects the two prefixes that mean this is NOT a class: `--` (a CSS custom
// property) and `$` (a Sass variable in the Bulma coexistence layer). Both
// have their own pattern below and their own source of truth; classifying
// either as a class sends it to be looked up in the built CSS, where it can
// never appear, and reports healthy code as stale.
const CLASS_NAME_PATTERN =
	/(?<![-$])\bstrand-[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?\b/g;

// CSS custom properties inside code spans: --strand-<identifier>
const CUSTOM_PROPERTY_PATTERN = /--strand-[a-z][a-z0-9]*(?:-[a-z0-9]+)*\b/g;

// Sass variables from the Bulma coexistence layer: $strand-<identifier>.
// These live in packages/tokens/bulma/_strand-bulma-vars.scss and are compiled
// away, so they are verified against that file rather than the CSS bundle.
const SASS_VARIABLE_PATTERN = /\$strand-[a-z][a-z0-9]*(?:-[a-z0-9]+)*\b/g;

// A guide naming a whole primitive family writes it as a glob: `strand-ref-*`.
// The trailing marker is kept so the token is checked as a family prefix. A
// family member is `strand-ref-shell`, where the segment after the prefix is
// part of the NAME, not a BEM separator, so the BEM heuristic below cannot
// resolve it and the truncated `strand-ref` reads as stale.
const CLASS_FAMILY_PATTERN =
	/(?<![-$])\bstrand-[a-z][a-z0-9]*(?:-[a-z0-9]+)*-\*/g;

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

// Pre-existing migration guide drift baseline: tokens known to be stale that
// the check reports without failing on. Future drift outside this set DOES
// fail the check.
//
// The baseline is now EMPTY, and keeping it that way is the point. Almost
// everything it once held was never drift at all: Sass variables (`$strand-*`)
// and stylesheet filenames were being classified as CSS classes and looked up
// in the built bundle, where by construction they can never appear. Thirteen
// grandfathered entries plus sixteen hard failures were, with one exception,
// all the same classifier bug wearing different hats.
//
// The exception is what makes this worth saying: `strand-card--elevated` was
// genuine drift. The Bootstrap guide told migrants to reach for a variant that
// does not exist, and that real defect sat undetected inside the noise for as
// long as the noise did. A check that cries wolf does not merely annoy people,
// it hides the one true finding among the false ones. Fix the classifier
// rather than growing this set.
const BASELINE_STALE = new Set([]);

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

export function extractStrandTokens(content) {
	const tokens = new Set();
	CODE_SPAN_PATTERN.lastIndex = 0;
	let spanMatch = CODE_SPAN_PATTERN.exec(content);
	while (spanMatch !== null) {
		const span = spanMatch[1];
		// A path or a bare filename is a file reference, not an API token.
		// `strand-bulma-compat.css` is a stylesheet consumers link; extracting
		// `strand-bulma-compat` from it and looking for a class by that name
		// reports a healthy file as a missing class.
		if (span.includes("/") || /\.(css|scss|sass|js|mjs|cjs|ts|tsx|json)\b/.test(span)) {
			spanMatch = CODE_SPAN_PATTERN.exec(content);
			continue;
		}
		// Order matters: each pattern below is a prefix or suffix of the plain
		// class pattern, so the more specific ones run first and their matches
		// are masked out of the span before class extraction sees it.
		let remaining = span;

		for (const pattern of [
			CUSTOM_PROPERTY_PATTERN,
			SASS_VARIABLE_PATTERN,
			CLASS_FAMILY_PATTERN,
		]) {
			pattern.lastIndex = 0;
			for (const match of span.matchAll(pattern)) {
				if (!isPlaceholder(match[0])) tokens.add(match[0]);
				remaining = remaining.replace(match[0], " ");
			}
		}

		CLASS_NAME_PATTERN.lastIndex = 0;
		for (const match of remaining.matchAll(CLASS_NAME_PATTERN)) {
			const token = match[0];
			if (token !== "strand-ui" && !isPlaceholder(token)) {
				tokens.add(token);
			}
		}
		spanMatch = CODE_SPAN_PATTERN.exec(content);
	}
	return tokens;
}

/**
 * Resolves a token against whichever source of truth actually defines its kind.
 *
 * @param {string} token
 * @param {{css: string, scss: string}} sources
 */
export function tokenExistsIn(token, sources) {
	const { css: cssContent, scss: scssContent } = sources;

	// Sass variables are compiled away and never reach the built CSS. Their
	// source of truth is the Bulma variables partial.
	if (token.startsWith("$")) {
		return new RegExp(`\\${token}\\s*:`).test(scssContent);
	}
	// For CSS variables: a definition (`--strand-...:`) or any var() READ of
	// it, with or without a fallback.
	//
	// THE FALLBACK ARM IS THE LOAD-BEARING ONE, and its absence was a hole
	// this check could not see through. A consumer-settable knob is never
	// defined by the library at all -- that is the point of it -- and it is
	// always read as `var(--strand-thing, <default>)`. `--strand-ref-sticky-top`
	// is exactly that shape, and so are `--strand-search-field-inline-size` and
	// the `--strand-dialog-*` properties.
	//
	// It nonetheless passed for months, because the built stylesheet used to
	// carry every source COMMENT, and LabShell.css documents the property with
	// a worked example containing the literal `--strand-ref-sticky-top:`. The
	// check was matching prose. Stripping comments from the artifact removed
	// the accidental evidence and left the real gap visible, which is the
	// useful kind of test failure: nothing broke, something stopped lying.
	if (token.startsWith("--")) {
		if (cssContent.includes(`${token}:`)) return true;
		return new RegExp(`var\\(\\s*${token.replace(/[^\w-]/g, "\\$&")}\\s*[,)]`).test(
			cssContent,
		);
	}
	// A family glob is satisfied by any member: `strand-ref-*` by
	// `.strand-ref-shell`. The prefix must be followed by a name segment, so a
	// family whose members have all been removed still reports stale.
	if (token.endsWith("-*")) {
		const prefix = token.slice(0, -1);
		return new RegExp(`\\.${prefix}[a-z0-9]`).test(cssContent);
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

async function readScss() {
	const path = join(
		REPO_ROOT,
		"packages",
		"tokens",
		"bulma",
		"_strand-bulma-vars.scss",
	);
	return (await exists(path)) ? readFile(path, "utf8") : "";
}

async function main() {
	const css = await readCss();
	const scss = await readScss();
	const sources = { css, scss };
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
			if (tokenExistsIn(token, sources)) continue;
			if (
				BASELINE_STALE.has(token) ||
				BASELINE_STALE.has(token.replace(/^[-$]+/, ""))
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

// Only run when invoked directly, so the classifier stays importable from tests
// without the check executing as an import side effect.
if (
	process.argv[1] &&
	resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
) {
	main().catch((err) => {
		console.error("\n  STALENESS CHECK ERROR:", err.message);
		process.exit(2);
	});
}
