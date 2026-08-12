// Unit tests for the pure half of the browser layout tier.
//
// The runner splits deliberately: everything that DECIDES is pure and tested
// here at sub-millisecond speed, and the only impure part is "launch Chromium,
// set a viewport, read box sizes". That split is what lets the decision layer
// be exercised against synthetic edge cases without paying for a browser.
//
// The cases that matter most below are the ones where a measurement is MISSING
// or a case is malformed. A layout assertion that evaluates to "pass" because
// it compared against undefined is the exact failure this whole tier exists to
// prevent, so it is pinned here rather than assumed.

import { describe, expect, it } from "vitest";
import {
	LAYOUT_CASES,
	checkBuildFreshness,
	evaluateCase,
	groupCasesByViewport,
	summarize,
	validateCases,
} from "../layout-check.mjs";

const box = (blockSize) => ({ blockSize, inlineSize: 100 });

describe("evaluateCase: exact block-size", () => {
	it("passes when the measured height is exactly the expected height", () => {
		const result = evaluateCase(
			{
				name: "empty collapses",
				primitive: "Reserve",
				expect: [{ of: "region", blockSize: 0 }],
			},
			{ region: box(0) },
		);
		expect(result.ok).toBe(true);
		expect(result.failures).toEqual([]);
	});

	it("fails when the region holds height it should have released", () => {
		// This is gap #63 exactly: visibility:hidden preserved the placeholder's
		// 42px where display:none was needed.
		const result = evaluateCase(
			{
				name: "empty collapses",
				primitive: "Reserve",
				expect: [{ of: "region", blockSize: 0 }],
			},
			{ region: box(42) },
		);
		expect(result.ok).toBe(false);
		expect(result.failures[0]).toContain("42");
		expect(result.failures[0]).toContain("0");
	});

	it("tolerates subpixel noise, which is layout reality and not a defect", () => {
		const result = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "region", blockSize: 42 }] },
			{ region: box(42.4) },
		);
		expect(result.ok).toBe(true);
	});

	it("does not tolerate a whole pixel, which is a real shift", () => {
		const result = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "region", blockSize: 42 }] },
			{ region: box(43) },
		);
		expect(result.ok).toBe(false);
	});
});

describe("evaluateCase: floors and ceilings", () => {
	it("blockSizeAtLeast passes at the boundary", () => {
		const result = evaluateCase(
			{
				name: "n",
				primitive: "P",
				expect: [{ of: "region", blockSizeAtLeast: 42 }],
			},
			{ region: box(42) },
		);
		expect(result.ok).toBe(true);
	});

	it("blockSizeAtLeast fails below the declared floor", () => {
		const result = evaluateCase(
			{
				name: "n",
				primitive: "P",
				expect: [{ of: "region", blockSizeAtLeast: 42 }],
			},
			{ region: box(41) },
		);
		expect(result.ok).toBe(false);
		expect(result.failures[0]).toContain("at least");
	});

	it("blockSizeAtMost fails above the declared ceiling", () => {
		const result = evaluateCase(
			{
				name: "n",
				primitive: "P",
				expect: [{ of: "region", blockSizeAtMost: 10 }],
			},
			{ region: box(11) },
		);
		expect(result.ok).toBe(false);
		expect(result.failures[0]).toContain("at most");
	});
});

describe("evaluateCase: equality between two measured regions", () => {
	it("passes when a swap did not change the height", () => {
		// The no-shift invariant: pending and ready must occupy the same box.
		const result = evaluateCase(
			{
				name: "swap cannot move layout",
				primitive: "Reserve",
				expect: [{ of: "pending", equals: "ready" }],
			},
			{ pending: box(42), ready: box(42) },
		);
		expect(result.ok).toBe(true);
	});

	it("fails when the swap moved the page, naming both measurements", () => {
		const result = evaluateCase(
			{
				name: "swap cannot move layout",
				primitive: "Reserve",
				expect: [{ of: "pending", equals: "ready" }],
			},
			{ pending: box(42), ready: box(96) },
		);
		expect(result.ok).toBe(false);
		expect(result.failures[0]).toContain("pending");
		expect(result.failures[0]).toContain("ready");
		expect(result.failures[0]).toContain("42");
		expect(result.failures[0]).toContain("96");
	});
});

describe("evaluateCase: a missing measurement must never read as a pass", () => {
	it("fails when the subject selector matched nothing", () => {
		const result = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "ghost", blockSize: 0 }] },
			{ region: box(0) },
		);
		expect(result.ok).toBe(false);
		expect(result.failures[0]).toContain("ghost");
	});

	it("fails rather than passing when comparing 0 against a missing element", () => {
		// The dangerous shape: expected 0, element absent, a naive implementation
		// reads undefined as falsy/zero and reports success.
		const result = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "ghost", blockSize: 0 }] },
			{},
		);
		expect(result.ok).toBe(false);
	});

	it("fails when the equality target is missing", () => {
		const result = evaluateCase(
			{
				name: "n",
				primitive: "P",
				expect: [{ of: "pending", equals: "ghost" }],
			},
			{ pending: box(42) },
		);
		expect(result.ok).toBe(false);
		expect(result.failures[0]).toContain("ghost");
	});

	it("reports every failing assertion, not just the first", () => {
		const result = evaluateCase(
			{
				name: "n",
				primitive: "P",
				expect: [
					{ of: "a", blockSize: 0 },
					{ of: "b", blockSize: 0 },
				],
			},
			{ a: box(10), b: box(20) },
		);
		expect(result.failures).toHaveLength(2);
	});
});

describe("validateCases: a malformed case is a build error, not a silent skip", () => {
	it("rejects a case whose assertion names a selector the case never measures", () => {
		const errors = validateCases([
			{
				name: "typo",
				primitive: "P",
				viewport: { width: 390, height: 844 },
				html: "<div></div>",
				measure: { region: "#region" },
				expect: [{ of: "regoin", blockSize: 0 }],
			},
		]);
		expect(errors).toHaveLength(1);
		expect(errors[0]).toContain("regoin");
	});

	it("rejects a case with no assertions, which would pass vacuously", () => {
		const errors = validateCases([
			{
				name: "empty",
				primitive: "P",
				viewport: { width: 390, height: 844 },
				html: "<div></div>",
				measure: { region: "#region" },
				expect: [],
			},
		]);
		expect(errors).toHaveLength(1);
		expect(errors[0]).toMatch(/assertion/i);
	});

	it("rejects an unknown assertion kind rather than ignoring it", () => {
		const errors = validateCases([
			{
				name: "bad kind",
				primitive: "P",
				viewport: { width: 390, height: 844 },
				html: "<div></div>",
				measure: { region: "#region" },
				expect: [{ of: "region", blockSizeIsVibes: 42 }],
			},
		]);
		expect(errors).toHaveLength(1);
	});

	it("accepts the real case set that ships with the repository", () => {
		expect(validateCases(LAYOUT_CASES)).toEqual([]);
	});
});

describe("groupCasesByViewport: the page resizes once per width, not once per case", () => {
	it("collapses cases that share a viewport into one group", () => {
		const groups = groupCasesByViewport([
			{ name: "a", viewport: { width: 390, height: 844 } },
			{ name: "b", viewport: { width: 390, height: 844 } },
		]);
		expect(groups).toHaveLength(1);
		expect(groups[0].cases).toHaveLength(2);
	});

	it("keeps distinct widths apart and orders them ascending", () => {
		const groups = groupCasesByViewport([
			{ name: "a", viewport: { width: 1024, height: 800 } },
			{ name: "b", viewport: { width: 390, height: 844 } },
			{ name: "c", viewport: { width: 768, height: 800 } },
		]);
		expect(groups.map((g) => g.width)).toEqual([390, 768, 1024]);
	});

	it("treats the same width at a different height as a separate group", () => {
		const groups = groupCasesByViewport([
			{ name: "a", viewport: { width: 390, height: 844 } },
			{ name: "b", viewport: { width: 390, height: 200 } },
		]);
		expect(groups).toHaveLength(2);
	});

	it("carries every case through, losing none", () => {
		const input = [
			{ name: "a", viewport: { width: 390, height: 844 } },
			{ name: "b", viewport: { width: 1024, height: 800 } },
			{ name: "c", viewport: { width: 390, height: 844 } },
		];
		const groups = groupCasesByViewport(input);
		const total = groups.reduce((n, g) => n + g.cases.length, 0);
		expect(total).toBe(input.length);
	});
});

describe("summarize", () => {
	it("counts assertions rather than only cases, so coverage is visible", () => {
		const s = summarize([
			{ ok: true, failures: [], assertionCount: 3 },
			{ ok: false, failures: ["x"], assertionCount: 2 },
		]);
		expect(s.total).toBe(2);
		expect(s.passed).toBe(1);
		expect(s.failed).toBe(1);
		expect(s.assertions).toBe(5);
	});

	it("reports zero cases as a failure, because an empty run is not a pass", () => {
		const s = summarize([]);
		expect(s.ok).toBe(false);
	});
});

describe("positional assertions: WHERE a box is, not only how big", () => {
	// Added after a consumer proved the tier could not express a single one of
	// their cases. Every original assertion kind was a statement about SIZE;
	// rect.top and rect.bottom were computed in the measure step and thrown
	// away. A region pinned to the bottom of the viewport has a contract about
	// position, and forcing that claim into blockSizeAtLeast would assert the
	// region's own height instead: a proxy for the mechanism rather than the
	// outcome, which is the exact trap docs/testing-tiers.md warns about.
	const at = (blockStart, blockEnd) => ({
		blockSize: blockEnd - blockStart,
		inlineSize: 100,
		blockStart,
		blockEnd,
	});

	it("blockStartAtLeast passes when the region sits low enough", () => {
		const r = evaluateCase(
			{
				name: "dock is in the thumb zone",
				primitive: "Dock",
				expect: [{ of: "dock", blockStartAtLeast: 563 }],
			},
			{ dock: at(700, 744) },
		);
		expect(r.ok).toBe(true);
	});

	it("blockStartAtLeast fails when the region sits too high to reach", () => {
		const r = evaluateCase(
			{
				name: "dock is in the thumb zone",
				primitive: "Dock",
				expect: [{ of: "dock", blockStartAtLeast: 563 }],
			},
			{ dock: at(200, 244) },
		);
		expect(r.ok).toBe(false);
		expect(r.failures[0]).toContain("200");
	});

	it("blockEndAtMost catches a region hanging off the bottom of the viewport", () => {
		const r = evaluateCase(
			{
				name: "dock clears the viewport bottom",
				primitive: "Dock",
				expect: [{ of: "dock", blockEndAtMost: 844 }],
			},
			{ dock: at(820, 900) },
		);
		expect(r.ok).toBe(false);
	});

	it("blockStartAtMost pins a region to the top region of the viewport", () => {
		const r = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "x", blockStartAtMost: 100 }] },
			{ x: at(150, 200) },
		);
		expect(r.ok).toBe(false);
	});

	it("a positional assertion against a missing element still fails", () => {
		const r = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "ghost", blockStartAtLeast: 0 }] },
			{},
		);
		// blockStartAtLeast: 0 is the dangerous shape, since an absent element
		// reads as 0 and would satisfy it.
		expect(r.ok).toBe(false);
	});

	it("equalsBlockStart holds two measured subjects to the same offset", () => {
		// NAMED CAREFULLY. An earlier name said "across two measured states",
		// which claimed a capability the runner does not have: it takes exactly
		// one measurement pass per case, so both subjects here come from the SAME
		// page state. The pure function was always correct; the name oversold it,
		// and a test name implying a capability the tier lacks is the same defect
		// this tier exists to catch, one level up.
		//
		// Scroll-independence is expressed with `scroll` plus a threshold, not
		// with this kind. See docs/testing-tiers.md.
		const r = evaluateCase(
			{
				name: "dock is scroll independent",
				primitive: "Dock",
				expect: [{ of: "atTop", equalsBlockStart: "atScrolled" }],
			},
			{ atTop: at(800, 844), atScrolled: at(800, 844) },
		);
		expect(r.ok).toBe(true);
	});

	it("equalsBlockStart fails when the two subjects sit at different offsets", () => {
		const r = evaluateCase(
			{
				name: "two docks agree",
				primitive: "Dock",
				expect: [{ of: "atTop", equalsBlockStart: "atScrolled" }],
			},
			{ atTop: at(800, 844), atScrolled: at(-1200, -1156) },
		);
		expect(r.ok).toBe(false);
		expect(r.failures[0]).toContain("800");
	});

	it("a lone floor cannot express containment, which is why bounds come in pairs", () => {
		// The first consumer's negative control caught this in their own case: a
		// dock at document y=3000, entirely off screen, satisfies a bare
		// blockStartAtLeast for the thumb zone. "Below the top of the band" and
		// "inside the band" are different claims.
		const offScreen = { blockSize: 64, inlineSize: 390, blockStart: 3000, blockEnd: 3064 };
		const floorOnly = evaluateCase(
			{ name: "n", primitive: "Dock", expect: [{ of: "dock", blockStartAtLeast: 563 }] },
			{ dock: offScreen },
		);
		expect(floorOnly.ok).toBe(true); // passes, and is meaningless

		const bounded = evaluateCase(
			{
				name: "n",
				primitive: "Dock",
				expect: [
					{ of: "dock", blockStartAtLeast: 563 },
					{ of: "dock", blockEndAtMost: 844 },
				],
			},
			{ dock: offScreen },
		);
		expect(bounded.ok).toBe(false);
	});
});

describe("clearance reporting: a case passing by one pixel is about to fail", () => {
	it("reports how far a threshold assertion cleared", () => {
		const r = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "x", blockSizeAtLeast: 180 }] },
			{ x: { blockSize: 400, inlineSize: 10 } },
		);
		expect(r.ok).toBe(true);
		expect(r.clearances[0].margin).toBe(220);
	});

	it("reports a thin clearance distinctly from a fat one", () => {
		const thin = evaluateCase(
			{ name: "n", primitive: "P", expect: [{ of: "x", blockSizeAtLeast: 180 }] },
			{ x: { blockSize: 180.5, inlineSize: 10 } },
		);
		expect(thin.clearances[0].margin).toBeCloseTo(0.5);
	});
});

describe("checkBuildFreshness: a stale build measures the wrong library", () => {
	// Found the hard way on this tier's very first run: dist/ is gitignored, the
	// local copy predated the 0.33.0 fix by a week, and the tier faithfully
	// measured a library nobody was running. It failed, so it was obvious.
	// The dangerous direction is the opposite one: a stale dist that still
	// CONTAINS the fix while the source has regressed reports green, which is
	// the silent pass this whole tier exists to prevent.

	it("passes when the build is newer than the source", () => {
		expect(
			checkBuildFreshness(2000, { path: "Reserve.css", mtimeMs: 1000 }),
		).toBeNull();
	});

	it("passes when they are identical, since one build wrote both", () => {
		expect(
			checkBuildFreshness(1000, { path: "Reserve.css", mtimeMs: 1000 }),
		).toBeNull();
	});

	it("fails when a source stylesheet is newer than the build", () => {
		const msg = checkBuildFreshness(1000, {
			path: "Reserve.css",
			mtimeMs: 2000,
		});
		expect(msg).toBeTruthy();
		expect(msg).toContain("Reserve.css");
	});

	it("names the fix, so the failure is actionable without investigation", () => {
		const msg = checkBuildFreshness(1000, {
			path: "Reserve.css",
			mtimeMs: 2000,
		});
		expect(msg).toContain("pnpm build");
	});

	it("invents no failure when there is no source to compare", () => {
		expect(checkBuildFreshness(1000, null)).toBeNull();
	});
});

describe("the shipped case set", () => {
	it("covers the Reserve empty-collapse regression that motivated the tier", () => {
		const reserve = LAYOUT_CASES.filter((c) => c.primitive === "Reserve");
		expect(reserve.length).toBeGreaterThan(0);
		const collapses = reserve.some((c) =>
			c.expect.some((a) => a.blockSize === 0),
		);
		expect(collapses).toBe(true);
	});

	it("asserts the no-shift invariant between pending and ready", () => {
		const hasEquality = LAYOUT_CASES.some((c) =>
			c.expect.some((a) => typeof a.equals === "string"),
		);
		expect(hasEquality).toBe(true);
	});

	it("exercises more than one viewport, since the contract is per breakpoint", () => {
		const widths = new Set(LAYOUT_CASES.map((c) => c.viewport.width));
		expect(widths.size).toBeGreaterThan(1);
	});
});

// ── Inline-axis assertion kinds ──
//
// Added because the rect was already measuring inlineSize and nothing could
// assert on it, so every claim about width was either smuggled in as a claim
// about height or simply left untested. 14.7 is a 44x44 rule and only one of
// those numbers was checkable: a touch target 44px tall and 12px wide passed.
//
// The MISMATCH cases below are the load-bearing ones. Every case in the real
// set passes, so the failure branch of a cross-subject comparison is never
// executed by `pnpm test:layout` -- a stale variable reference lived there
// through a fully green run and was found only by a negative control. These
// pin all three prose branches so that cannot happen again.

describe("inline-axis assertions", () => {
	const M = {
		a: { blockSize: 36, inlineSize: 300, blockStart: 0, blockEnd: 36 },
		b: { blockSize: 40, inlineSize: 250, blockStart: 10, blockEnd: 50 },
	};
	const run = (expect) =>
		evaluateCase({ primitive: "X", name: "c", expect }, M).failures;

	it("accepts an exact inline-size and rejects a wrong one", () => {
		expect(run([{ of: "a", inlineSize: 300 }])).toEqual([]);
		expect(run([{ of: "a", inlineSize: 299 }])).toHaveLength(1);
	});

	it("enforces an inline-size floor, which is 14.7's second dimension", () => {
		expect(run([{ of: "a", inlineSizeAtLeast: 44 }])).toEqual([]);
		expect(run([{ of: "b", inlineSizeAtLeast: 400 }])).toHaveLength(1);
	});

	it("enforces an inline-size ceiling", () => {
		expect(run([{ of: "a", inlineSizeAtMost: 300 }])).toEqual([]);
		expect(run([{ of: "a", inlineSizeAtMost: 100 }])).toHaveLength(1);
	});

	it("compares two subjects' widths", () => {
		expect(run([{ of: "a", equalsInlineSize: "a" }])).toEqual([]);
		expect(run([{ of: "a", equalsInlineSize: "b" }])).toHaveLength(1);
	});

	// One per field, because the message is selected by field and a wrong
	// selection is invisible until someone reads a failure they did not expect.
	it("names the right axis in each cross-subject failure", () => {
		expect(run([{ of: "a", equalsInlineSize: "b" }])[0]).toContain(
			"must be the same width",
		);
		expect(run([{ of: "a", equalsBlockStart: "b" }])[0]).toContain(
			"must sit at the same block-start",
		);
		expect(run([{ of: "a", equals: "b" }])[0]).toContain(
			"must occupy the same box",
		);
	});

	it("rejects a case whose cross-subject target is not measured", () => {
		expect(run([{ of: "a", equalsInlineSize: "ghost" }])[0]).toContain(
			"was not found",
		);
	});
});
