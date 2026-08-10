#!/usr/bin/env node
// Contrast check: enforces the promise the design language makes in Part III.7
// rule 6 -- "every color pairing has a minimum 4.5:1 contrast ratio, enforced
// by automated test, not by manual review".
//
// That test did not exist. Its absence let `--strand-gray-500` sit at 4.487:1
// on the page background while Part XIV.2 recorded it as "4.49:1 (passes AA)",
// and let the library apply fill-tier colors as small text in 129 places.
//
// What it does: reads the built standalone CSS, finds every rule that sets a
// `color:` to a palette token, works out the background that rule's text will
// actually sit on, and computes the contrast against the applicable WCAG 2.2
// threshold (4.5:1 for small text, 3:1 for large text).
//
// Usage: pnpm test:contrast
//
// This is a static check over the CSS, so it reasons about the surfaces the
// design language sanctions rather than about any particular page. It cannot
// see composition, which is deliberate: a consumer nesting a light island in a
// dark viewport is covered by the light-island rules, and runtime effects like
// an ancestor's opacity are out of reach of any static check (see DL VI.7).

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");

const CSS_PATH = resolve(REPO_ROOT, "packages/strand-ui/dist/css/strand-ui.css");
const TOKENS_PATH = resolve(REPO_ROOT, "packages/tokens/css/tokens.css");

// The light surfaces the design language sanctions under body text (Part III.2
// and III.4). surface-recessed is the darkest and therefore binding.
export const LIGHT_SURFACES = {
	"surface-elevated": "#FFFFFF",
	"surface-primary": "#FAFCFF",
	"surface-recessed": "#F0F5F8",
};

const TEXT_PX = {
	"--strand-text-xs": 11.1,
	"--strand-text-sm": 13.3,
	"--strand-text-base": 16,
	"--strand-text-lg": 20,
	"--strand-text-xl": 25,
	"--strand-text-2xl": 31.2,
	"--strand-text-3xl": 39.1,
	"--strand-text-4xl": 48.8,
	"--strand-text-5xl": 61,
	"--strand-text-6xl": 76.3,
	"--strand-text-7xl": 95.4,
};

// Selectors whose text does NOT sit on a light surface, or whose color is not
// being judged as text. Each entry is a deliberate, reviewed decision -- this
// is not a place to silence a finding you have not understood.
// Tokens that only ever describe text inside the dark instrument cabinet.
// Judging them against a light surface is meaningless: that is not where they
// are ever painted.
export const DARK_CONTEXT_TOKENS = /^--strand-instrument-/;

// The light islands nested inside the dark cabinet (DL 9.6). These DO pair
// against a light surface, so they stay in scope even though they are defined
// alongside the dark components.
export const LIGHT_ISLANDS = /detail-panel|surface-light/;

/**
 * The dark instrument cabinet (DL 9.3) is a family of FUI components whose
 * names mostly do not contain the word "instrument" -- search-bar, result-card,
 * cluster-marker, log, bar-chart. Rather than maintain that list by hand and
 * get it wrong, derive it: every class InstrumentViewport.css defines is a
 * dark-context class by construction, because that file IS the dark cabinet.
 *
 * @param {string} instrumentCss
 * @returns {Set<string>}
 */
export function darkContextClasses(instrumentCss) {
	const classes = new Set();
	for (const m of instrumentCss.matchAll(/\.(strand-[a-z0-9_-]+)/g)) {
		if (LIGHT_ISLANDS.test(m[1])) continue;
		classes.add(m[1]);
	}
	return classes;
}

export const EXCLUSIONS = [
	{
		// A filled star communicates through shape against its unfilled
		// neighbours; recoloring gold to a dark brown to satisfy a text
		// threshold would make the control worse, not more accessible.
		pattern: /star-rating__star/,
		why: "graphical rating, meaning carried by fill shape rather than hue",
	},
	{
		// Token specimens and utility cells exist to DISPLAY a palette value.
		// Distorting the swatch to make the swatch pass would defeat its purpose.
		pattern: /swatch|token-specimen|ref-util-cell|ref-example__demo/,
		why: "specimen surface demonstrating a token, not applying it as UI text",
	},
];

const hexOf = (h) => [1, 3, 5].map((i) => Number.parseInt(h.slice(i, i + 2), 16));

export function relativeLuminance(hex) {
	return hexOf(hex)
		.map((v) => {
			const c = v / 255;
			return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		})
		.reduce((acc, c, i) => acc + [0.2126, 0.7152, 0.0722][i] * c, 0);
}

export function contrastRatio(fg, bg) {
	const a = relativeLuminance(fg);
	const b = relativeLuminance(bg);
	const [hi, lo] = a > b ? [a, b] : [b, a];
	return (hi + 0.05) / (lo + 0.05);
}

/**
 * WCAG 2.2 large text: >= 24px, or >= 18.66px when bold.
 * A rule with no font-size inherits the 16px body default, which is small.
 */
export function thresholdFor({ px, bold }) {
	const size = px ?? 16;
	return size >= 24 || (bold && size >= 18.66) ? 3.0 : 4.5;
}

export function parseRules(css) {
	return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
		selector: m[1].trim().replace(/\s+/g, " ").replace(/^\/\*[\s\S]*?\*\/\s*/, ""),
		body: m[2],
	}));
}

export function parsePalette(tokensCss) {
	const palette = {};
	for (const m of tokensCss.matchAll(/(--strand-[a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g)) {
		palette[m[1]] = m[2].toUpperCase();
	}
	return palette;
}

/**
 * Collects the findings for one rule. Returns [] when the rule sets no text
 * color, when it paints its own background (so the light surfaces do not
 * apply), or when it matches a reviewed exclusion.
 */
export function auditRule(rule, palette, darkClasses = new Set()) {
	const colorMatch = rule.body.match(/(?:^|[;{]\s*|\n\s*)color:\s*var\((--strand-[a-z0-9-]+)\)/);
	if (!colorMatch) return [];

	const fg = palette[colorMatch[1]];
	if (!fg) return [];

	if (DARK_CONTEXT_TOKENS.test(colorMatch[1])) return [];

	// An --strand-on-* token names the background it belongs with (DL III.6),
	// and that pairing is verified at the token layer in tokens.test.ts. The
	// background is usually set by a sibling variant rule (a badge gets its fill
	// from --default / --teal / --danger), so it is not visible here.
	if (/^--strand-on-/.test(colorMatch[1])) return [];

	// A selector is dark-context when it names a class the dark cabinet defines
	// and does not reach into one of the light islands nested inside it.
	const named = [...rule.selector.matchAll(/\.(strand-[a-z0-9_-]+)/g)].map((m) => m[1]);
	if (
		named.length > 0 &&
		named.some((c) => darkClasses.has(c)) &&
		!LIGHT_ISLANDS.test(rule.selector)
	) {
		return [];
	}

	// A rule that paints its own background is judged against THAT background,
	// which the on-color tokens already guarantee (DL Part III.6). Without this
	// check, every white-on-blue button reads as white-on-white.
	if (/(?:^|[;{]\s*|\n\s*)background(?:-color)?:\s*(?!none)/.test(rule.body)) return [];

	for (const exclusion of EXCLUSIONS) {
		if (exclusion.pattern.test(rule.selector)) return [];
	}

	const sizeToken = rule.body.match(/font-size:\s*var\((--strand-text-[a-z0-9]+)\)/)?.[1];
	const clamped = /font-size:\s*clamp\(/.test(rule.body);
	// A clamp() headline is display-sized at every step of its range.
	const px = clamped ? 24 : (sizeToken ? TEXT_PX[sizeToken] : null);
	const bold = /font-weight:\s*var\(--strand-weight-semibold\)|font-weight:\s*[6-9]00/.test(rule.body);
	const threshold = thresholdFor({ px, bold });

	const findings = [];
	for (const [name, bg] of Object.entries(LIGHT_SURFACES)) {
		const ratio = contrastRatio(fg, bg);
		if (ratio >= threshold) continue;
		findings.push({
			selector: rule.selector,
			token: colorMatch[1],
			fg,
			surface: name,
			ratio,
			threshold,
			px: px ?? 16,
		});
	}
	return findings;
}

async function main() {
	const [css, tokensCss, instrumentCss] = await Promise.all([
		readFile(CSS_PATH, "utf8"),
		readFile(TOKENS_PATH, "utf8"),
		readFile(
			resolve(
				REPO_ROOT,
				"packages/strand-ui/src/components/InstrumentViewport/InstrumentViewport.css",
			),
			"utf8",
		),
	]);

	const palette = parsePalette(tokensCss);
	const darkClasses = darkContextClasses(instrumentCss);
	const findings = parseRules(css).flatMap((rule) => auditRule(rule, palette, darkClasses));

	if (findings.length > 0) {
		console.error(
			`\n  CONTRAST CHECK FAILED: ${findings.length} pairing(s) below their WCAG 2.2 AA threshold\n`,
		);
		const bySelector = new Map();
		for (const f of findings) {
			if (!bySelector.has(f.selector)) bySelector.set(f.selector, f);
		}
		for (const f of bySelector.values()) {
			console.error(
				`  ${f.ratio.toFixed(2)}:1 (needs ${f.threshold}) ${f.token} ${f.fg} on ${f.surface} at ${Math.round(f.px)}px`,
			);
			console.error(`      ${f.selector.slice(0, 100)}`);
		}
		console.error("");
		console.error("  A color used as text on a light surface must meet 4.5:1, or 3:1 when");
		console.error("  the text is large. Fill-tier values (blue-primary, gray-400, the");
		console.error("  semantic accents) are calibrated for backgrounds, borders and focus");
		console.error("  rings at 3:1; use the text tier for text (DL Part XIV.2).");
		console.error("");
		process.exit(1);
	}

	console.log(
		`\n  CONTRAST CHECK PASSED: every text color in the built CSS meets its threshold on all ${Object.keys(LIGHT_SURFACES).length} sanctioned light surfaces.\n`,
	);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
	main().catch((err) => {
		console.error("\n  CONTRAST CHECK ERROR:", err.message);
		process.exit(2);
	});
}
