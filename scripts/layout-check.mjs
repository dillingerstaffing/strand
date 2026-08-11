#!/usr/bin/env node
// Layout check: the browser tier.
//
// Every other test in this repository runs in jsdom, which does not lay out.
// Measured directly: a region with a declared 42px floor reports offsetHeight
// 0, an element with a literal `min-block-size: 42px` also reports 0, computed
// style returns `var(--strand-reserve-h, auto)` unresolved, and matchMedia is
// not a function. So no test here could distinguish `visibility: hidden` from
// `display: none` by height, which is precisely how the Reserve primitive
// shipped at 0.32.0 with a region that never collapsed. The library learned
// about its own layout bug from a consumer. See docs/testing-tiers.md.
//
// This check renders the CLASS LAYER against the BUILT stylesheet in real
// Chromium and measures the resulting boxes. It tests the classes rather than
// the Preact components on purpose: the class layer is the primitive and every
// framework wrapper is a thin wrapper over exactly those classes (a claim
// `pnpm test:parity` enforces separately), so one browser boot covers all eight
// consumer types.
//
// It is not visual regression. There are no baselines and no pixel diffs. Each
// case states a numeric contract and a failure prints the measured number
// beside the expected one.
//
// Usage: pnpm test:layout

import { glob, readFile, stat } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const CSS_PATH = resolve(REPO_ROOT, "packages/strand-ui/dist/css/strand-ui.css");

// Subpixel noise is layout reality, not a defect. A whole pixel is a real
// shift, so the tolerance sits below one and above rounding.
const TOLERANCE_PX = 0.5;

// ── The cases ──
//
// A primitive earns a case only when its reason for existing is a statement
// about space. Most primitives make no such promise and belong in the static
// or jsdom tiers, which are far cheaper.

const RESERVE_MARKUP = (state, extra = "") => `
	<div id="region" class="strand-reserve" data-strand-reserve="${state}" ${extra}>
		<div class="strand-reserve__placeholder" aria-hidden="true">
			<div style="block-size: 42px">placeholder</div>
		</div>
		<div class="strand-reserve__content"></div>
	</div>`;

export const LAYOUT_CASES = [
	{
		name: "empty state collapses to nothing",
		primitive: "Reserve",
		// The gap #63 regression. Before 0.33.0 the empty state hid the
		// placeholder with visibility, which preserves layout, so a region whose
		// content resolved to nothing held the placeholder's height forever.
		// No layout-shift score can see this, because nothing moves.
		viewport: { width: 390, height: 844 },
		html: RESERVE_MARKUP("empty"),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSize: 0 }],
	},
	{
		name: "pending state holds the box the content will need",
		primitive: "Reserve",
		viewport: { width: 390, height: 844 },
		html: RESERVE_MARKUP("pending"),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 42 }],
	},
	{
		name: "the placeholder to content swap cannot move the page",
		primitive: "Reserve",
		// The whole reason the primitive exists. Both layers share one grid
		// cell, so pending and ready must measure identically.
		viewport: { width: 390, height: 844 },
		html: `
			${RESERVE_MARKUP("pending").replace(/id="region"/, 'id="pending"')}
			<div id="ready" class="strand-reserve" data-strand-reserve="ready">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 42px">placeholder</div>
				</div>
				<div class="strand-reserve__content">
					<div style="block-size: 42px">real content</div>
				</div>
			</div>`,
		measure: { pending: "#pending", ready: "#ready" },
		expect: [{ of: "pending", equals: "ready" }],
	},
	{
		name: "a declared floor is honoured when the placeholder is shorter",
		primitive: "Reserve",
		viewport: { width: 390, height: 844 },
		html: `
			<div id="region" class="strand-reserve" data-strand-reserve="pending"
			     style="--strand-reserve-h: 180px">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 20px">short</div>
				</div>
				<div class="strand-reserve__content"></div>
			</div>`,
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 180 }],
	},
	{
		name: "no floor declared invents no reservation",
		primitive: "Reserve",
		// Unset must mean "no floor". Defaulting to a number would invent a
		// reservation nobody asked for, and would hide a mis-sized placeholder.
		viewport: { width: 390, height: 844 },
		html: `
			<div id="region" class="strand-reserve" data-strand-reserve="pending">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 20px">short</div>
				</div>
				<div class="strand-reserve__content"></div>
			</div>`,
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtMost: 20 }],
	},
	{
		name: "the base floor still applies below the md breakpoint",
		primitive: "Reserve",
		viewport: { width: 390, height: 844 },
		html: RESERVE_MARKUP(
			"pending",
			'style="--strand-reserve-h: 120px; --strand-reserve-h-md: 200px"',
		),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtMost: 120 }],
	},
	{
		name: "the md floor takes over at 768 and above",
		primitive: "Reserve",
		// The per-breakpoint fallback chain. jsdom cannot evaluate this at all:
		// matchMedia is absent and innerWidth is a fixed 1024 meaning nothing.
		viewport: { width: 768, height: 800 },
		html: RESERVE_MARKUP(
			"pending",
			'style="--strand-reserve-h: 120px; --strand-reserve-h-md: 200px"',
		),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 200 }],
	},
	{
		name: "the md floor keeps holding at lg when no lg floor is given",
		primitive: "Reserve",
		// Each step falls back to the one below, so setting only the base or
		// only md must hold at every width above it.
		viewport: { width: 1024, height: 800 },
		html: RESERVE_MARKUP(
			"pending",
			'style="--strand-reserve-h: 120px; --strand-reserve-h-md: 200px"',
		),
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtLeast: 200 }],
	},
	{
		name: "no state attribute degrades to a plain wrapper showing content",
		primitive: "Reserve",
		// A server-rendered consumer that never flips the attribute must get the
		// content, not a blank region and not a doubled height.
		viewport: { width: 1024, height: 800 },
		html: `
			<div id="region" class="strand-reserve">
				<div class="strand-reserve__placeholder" aria-hidden="true">
					<div style="block-size: 42px">placeholder</div>
				</div>
				<div class="strand-reserve__content">
					<div style="block-size: 30px">real content</div>
				</div>
			</div>`,
		measure: { region: "#region" },
		expect: [{ of: "region", blockSizeAtMost: 30 }],
	},
];

// ── Pure decision layer ──

const ASSERTION_KINDS = ["blockSize", "blockSizeAtLeast", "blockSizeAtMost", "equals"];

/**
 * Static validation of the case set. A case whose assertion names a selector
 * the case never measures would otherwise fail at run time as a missing
 * measurement, which reads like a layout bug rather than a typo. A case with no
 * assertions would pass vacuously, which is worse.
 */
export function validateCases(cases) {
	const errors = [];
	for (const c of cases) {
		const label = `${c.primitive}/${c.name}`;
		if (!Array.isArray(c.expect) || c.expect.length === 0) {
			errors.push(`${label}: has no assertion, so it would pass vacuously`);
			continue;
		}
		const declared = Object.keys(c.measure ?? {});
		for (const a of c.expect) {
			if (!declared.includes(a.of)) {
				errors.push(
					`${label}: asserts on "${a.of}", which is not one of the measured selectors (${declared.join(", ")})`,
				);
			}
			const kind = ASSERTION_KINDS.find((k) => k in a);
			if (!kind) {
				errors.push(
					`${label}: assertion on "${a.of}" names no known kind (expected one of ${ASSERTION_KINDS.join(", ")})`,
				);
				continue;
			}
			if (kind === "equals" && !declared.includes(a.equals)) {
				errors.push(
					`${label}: compares against "${a.equals}", which is not measured`,
				);
			}
		}
	}
	return errors;
}

/**
 * Groups cases so the page is resized once per viewport rather than once per
 * case. Ascending width, which also makes the output read in breakpoint order.
 */
export function groupCasesByViewport(cases) {
	const byKey = new Map();
	for (const c of cases) {
		const { width, height } = c.viewport;
		const key = `${width}x${height}`;
		if (!byKey.has(key)) byKey.set(key, { width, height, cases: [] });
		byKey.get(key).cases.push(c);
	}
	return [...byKey.values()].sort(
		(a, b) => a.width - b.width || a.height - b.height,
	);
}

/**
 * Evaluates one case against its measurements. Pure: takes numbers, returns a
 * verdict. A missing measurement is always a failure and never a pass, because
 * the dangerous shape is `expected 0` compared against an absent element.
 */
export function evaluateCase(caseDef, measurements) {
	const failures = [];
	const label = (key) => `${caseDef.primitive}/${caseDef.name}`;

	for (const a of caseDef.expect) {
		const subject = measurements[a.of];
		if (!subject) {
			failures.push(
				`${label()}: "${a.of}" was not found in the rendered page, so nothing was measured`,
			);
			continue;
		}
		const measured = subject.blockSize;

		if ("blockSize" in a) {
			if (Math.abs(measured - a.blockSize) > TOLERANCE_PX) {
				failures.push(
					`${label()}: "${a.of}" expected block-size ${a.blockSize}, measured ${measured}`,
				);
			}
		} else if ("blockSizeAtLeast" in a) {
			if (measured < a.blockSizeAtLeast - TOLERANCE_PX) {
				failures.push(
					`${label()}: "${a.of}" expected block-size at least ${a.blockSizeAtLeast}, measured ${measured}`,
				);
			}
		} else if ("blockSizeAtMost" in a) {
			if (measured > a.blockSizeAtMost + TOLERANCE_PX) {
				failures.push(
					`${label()}: "${a.of}" expected block-size at most ${a.blockSizeAtMost}, measured ${measured}`,
				);
			}
		} else if ("equals" in a) {
			const other = measurements[a.equals];
			if (!other) {
				failures.push(
					`${label()}: "${a.equals}" was not found in the rendered page, so nothing was compared`,
				);
				continue;
			}
			if (Math.abs(measured - other.blockSize) > TOLERANCE_PX) {
				failures.push(
					`${label()}: "${a.of}" and "${a.equals}" must occupy the same box, measured ${measured} and ${other.blockSize}`,
				);
			}
		}
	}

	return {
		name: caseDef.name,
		primitive: caseDef.primitive,
		ok: failures.length === 0,
		failures,
		assertionCount: caseDef.expect.length,
	};
}

/**
 * The tier measures the BUILT stylesheet, so a stale build measures a library
 * nobody is running. Caught on this tier's first run: dist/ is gitignored and
 * the local copy predated the 0.33.0 fix by a week.
 *
 * The direction that matters is not the one that was caught. A stale build
 * still containing a fix, while the source has regressed, reports green, and a
 * silent pass is the exact failure this tier exists to prevent.
 */
export function checkBuildFreshness(builtMtimeMs, newestSource) {
	if (!newestSource) return null;
	if (newestSource.mtimeMs <= builtMtimeMs) return null;
	return (
		`layout-check: the built stylesheet is older than ${newestSource.path}, ` +
		"so this would measure a library that is not the one in the source tree.\n" +
		"  pnpm build"
	);
}

export function summarize(results) {
	const passed = results.filter((r) => r.ok).length;
	const failed = results.length - passed;
	return {
		total: results.length,
		passed,
		failed,
		assertions: results.reduce((n, r) => n + (r.assertionCount ?? 0), 0),
		// An empty run is not a pass. A check that measured nothing has verified
		// nothing, and reporting green for it is how a tier rots unnoticed.
		ok: results.length > 0 && failed === 0,
	};
}

/** The page shell. The built stylesheet is inlined so there is no network. */
export function buildFixture(css, bodyHtml) {
	return `<!doctype html><html><head><meta charset="utf-8">
<style>${css}</style>
<style>
	/* Zero the shell so a measurement reflects the primitive and nothing else. */
	*, *::before, *::after { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	/* Animations would make a measurement depend on when it was taken. */
	*, *::before, *::after {
		transition: none !important;
		animation: none !important;
	}
</style>
</head><body>${bodyHtml}</body></html>`;
}

// ── Impure: the filesystem and the browser ──

/** Newest hand-authored stylesheet across the packages the bundle is built from. */
async function newestSourceStylesheet() {
	let newest = null;
	for await (const entry of glob("packages/*/src/**/*.css", { cwd: REPO_ROOT })) {
		const abs = resolve(REPO_ROOT, entry);
		const s = await stat(abs);
		if (!newest || s.mtimeMs > newest.mtimeMs) {
			newest = { path: relative(REPO_ROOT, abs), mtimeMs: s.mtimeMs };
		}
	}
	return newest;
}

// ── Impure: the browser ──

async function loadChromium() {
	try {
		const { chromium } = await import("playwright");
		return chromium;
	} catch {
		console.error(
			"layout-check: playwright is not installed.\n" +
				"  pnpm install\n" +
				"  pnpm exec playwright install chromium",
		);
		process.exit(1);
	}
}

async function main() {
	const caseErrors = validateCases(LAYOUT_CASES);
	if (caseErrors.length > 0) {
		console.error("layout-check: the case set is malformed.\n");
		for (const e of caseErrors) console.error(`  ${e}`);
		process.exit(1);
	}

	let css;
	let builtStat;
	try {
		css = await readFile(CSS_PATH, "utf8");
		builtStat = await stat(CSS_PATH);
	} catch {
		console.error(
			`layout-check: built stylesheet not found at ${CSS_PATH}\n  pnpm build`,
		);
		process.exit(1);
	}

	const staleness = checkBuildFreshness(
		builtStat.mtimeMs,
		await newestSourceStylesheet(),
	);
	if (staleness) {
		console.error(staleness);
		process.exit(1);
	}

	const chromium = await loadChromium();
	let browser;
	try {
		browser = await chromium.launch();
	} catch (err) {
		// Never skip. A layout tier that quietly no-ops when the browser is
		// missing is worse than no tier, because the green tick then asserts
		// that geometry was verified when nothing was rendered.
		console.error(
			`layout-check: could not launch Chromium (${err.message.split("\n")[0]}).\n` +
				"  pnpm exec playwright install chromium",
		);
		process.exit(1);
	}

	const started = Date.now();
	const results = [];
	const page = await browser.newPage();

	for (const group of groupCasesByViewport(LAYOUT_CASES)) {
		await page.setViewportSize({ width: group.width, height: group.height });
		for (const c of group.cases) {
			await page.setContent(buildFixture(css, c.html));
			const measurements = await page.evaluate((selectors) => {
				const out = {};
				for (const [key, selector] of Object.entries(selectors)) {
					const el = document.querySelector(selector);
					if (!el) continue;
					const rect = el.getBoundingClientRect();
					out[key] = { blockSize: rect.height, inlineSize: rect.width };
				}
				return out;
			}, c.measure);
			results.push(evaluateCase(c, measurements));
		}
	}

	await browser.close();

	const summary = summarize(results);
	const elapsed = ((Date.now() - started) / 1000).toFixed(1);

	if (!summary.ok) {
		console.error("\nLayout check FAILED.\n");
		for (const r of results.filter((x) => !x.ok)) {
			for (const f of r.failures) console.error(`  ${f}`);
		}
		console.error(
			`\n${summary.failed} of ${summary.total} cases failed (${summary.assertions} assertions, ${elapsed}s).`,
		);
		process.exit(1);
	}

	console.log(
		`Layout clean. ${summary.total} cases, ${summary.assertions} assertions, real Chromium, ${elapsed}s.`,
	);
}

// Only run when invoked directly, so the unit tests can import the pure half.
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
	await main();
}
