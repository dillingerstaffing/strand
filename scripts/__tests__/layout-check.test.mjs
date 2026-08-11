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
