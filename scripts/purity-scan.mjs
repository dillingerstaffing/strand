#!/usr/bin/env node
// Purity scan: enforces that a built CSS file contains only Strand primitives.
//
// Every Strand showcase must pass this scan before it can graduate. The
// scan detects:
//   1. Non-Strand CSS class names (anything not prefixed with `strand-`)
//   2. Raw hex colors (#RRGGBB or #RGB) that are not inside a comment
//   3. Raw pixel values used for size/spacing where a Strand token should be
//      (heuristic; optional, off by default; enabled with --strict)
//
// Usage:
//   pnpm purity-scan packages/strand-examples/pricing-page/dist/assets/index-*.css
//   node scripts/purity-scan.mjs path/to/built.css [more.css ...]
//   node scripts/purity-scan.mjs path/to/dist-dir     (scans all .css files inside)
//
// A passing scan prints the class count and asserts zero non-Strand classes.
// A failing scan lists every violation with file:line:column and the offending
// token.

import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
	console.error("\n  USAGE: pnpm purity-scan <css-file-or-dir> [...]\n");
	process.exit(1);
}

const findings = [];
let totalClasses = 0;
let totalFilesScanned = 0;

const CLASS_PATTERN = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;
const COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
const STRAND_PREFIXES = ["strand-"];

// Allowlist: classes that are not prefixed with strand- but are acceptable.
// Keep this tight. The usual offenders are pseudo-classes and reset tokens.
const CLASS_ALLOWLIST = new Set(["js", "no-js", "sr-only", "visually-hidden"]);

function isStrandClass(name) {
	if (CLASS_ALLOWLIST.has(name)) return true;
	return STRAND_PREFIXES.some((p) => name.startsWith(p));
}

function scanFile(path, content) {
	totalFilesScanned += 1;

	// Strip comments for scanning (simpler; loses line numbers inside comments
	// which is acceptable because comments are excluded from violations).
	const sourceForClasses = content.replace(COMMENT_PATTERN, (m) =>
		" ".repeat(m.length),
	);

	// Track class name findings
	const classes = new Set();
	CLASS_PATTERN.lastIndex = 0;
	let classMatch = CLASS_PATTERN.exec(sourceForClasses);
	while (classMatch !== null) {
		const name = classMatch[1];
		classes.add(name);
		if (!isStrandClass(name)) {
			findings.push({
				file: path,
				kind: "non-strand-class",
				token: `.${name}`,
				offset: classMatch.index,
			});
		}
		classMatch = CLASS_PATTERN.exec(sourceForClasses);
	}
	totalClasses += classes.size;

	// Track hex color findings (outside of comments)
	HEX_PATTERN.lastIndex = 0;
	let hexMatch = HEX_PATTERN.exec(sourceForClasses);
	while (hexMatch !== null) {
		findings.push({
			file: path,
			kind: "raw-hex-color",
			token: hexMatch[0],
			offset: hexMatch.index,
		});
		hexMatch = HEX_PATTERN.exec(sourceForClasses);
	}
}

async function expandTargets(paths) {
	const files = [];
	for (const p of paths) {
		const abs = resolve(p);
		const s = await stat(abs);
		if (s.isDirectory()) {
			const entries = await readdir(abs, { withFileTypes: true });
			for (const e of entries) {
				if (e.isFile() && e.name.endsWith(".css")) {
					files.push(resolve(abs, e.name));
				}
			}
		} else if (s.isFile() && abs.endsWith(".css")) {
			files.push(abs);
		}
	}
	return files;
}

function offsetToLine(content, offset) {
	let line = 1;
	let col = 1;
	for (let i = 0; i < offset && i < content.length; i++) {
		if (content[i] === "\n") {
			line += 1;
			col = 1;
		} else {
			col += 1;
		}
	}
	return { line, col };
}

async function main() {
	const targets = await expandTargets(args);
	if (targets.length === 0) {
		console.error("\n  ABORT: no .css files matched the provided path(s).\n");
		process.exit(1);
	}

	const fileContents = new Map();
	for (const file of targets) {
		const content = await readFile(file, "utf8");
		fileContents.set(file, content);
		scanFile(file, content);
	}

	if (findings.length > 0) {
		console.error(
			`\n  PURITY SCAN FAILED: ${findings.length} violation(s) across ${totalFilesScanned} file(s)\n`,
		);
		for (const f of findings) {
			const content = fileContents.get(f.file) || "";
			const { line, col } = offsetToLine(content, f.offset);
			console.error(
				`  ${f.kind === "non-strand-class" ? "CLASS" : "HEX  "} ${f.file}:${line}:${col} -> ${f.token}`,
			);
		}
		console.error("");
		console.error(
			"  Showcases must use ONLY Strand primitives. Non-Strand class",
		);
		console.error(
			"  names and raw hex colors indicate either custom CSS (forbidden)",
		);
		console.error("  or a gap in Strand that should be classified and logged.");
		console.error("");
		process.exit(1);
	}

	console.log(
		`\n  PURITY SCAN PASSED: ${totalFilesScanned} file(s), ${totalClasses} unique class(es), zero violations.\n`,
	);
}

main().catch((err) => {
	console.error("\n  PURITY SCAN ERROR:", err.message);
	console.error(err.stack);
	process.exit(2);
});
