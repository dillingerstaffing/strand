// Unit tests for the pure half of the bundle budget gate.
//
// The defect this closes is not the number, it is the claim of enforcement.
// design-language.md 16.1 recorded "Total library size, < 50KB gzipped, Build
// step validation" while no build step validated it and the artifact stood at
// 78KB. `measure-bundle` wrote the figure into the manifest and exited 0
// whatever it found, so the number drifted 63 to 66 to 71 to 77 to 78 across a
// single day underneath a specification asserting both a limit and a gate.

import { describe, expect, it } from "vitest";
import { BUDGET, evaluate, summarize } from "../bundle-budget-check.mjs";

// The real measurement at the time the budget was written, so these tests
// fail loudly if someone raises a limit without touching them.
const TODAY = { totalGzBytes: 79812, cssGzBytes: 67231, componentCount: 59 };

describe("evaluate", () => {
	it("passes the artifact as it stands", () => {
		expect(evaluate(TODAY).ok).toBe(true);
	});

	it("fails a total over the ceiling", () => {
		const r = evaluate({ ...TODAY, totalGzBytes: 95 * 1024 });
		expect(r.ok).toBe(false);
		expect(r.failures[0]).toContain("over the 85 KB ceiling");
	});

	// THE AVERAGE CANNOT DO THIS, and this test is why the budget has a third
	// number. It was first written asserting the average would catch a
	// bloated component, and it failed: 12 KB spread across 59 other
	// components moves the average to 1.29 and passes a 1.35 ceiling.
	// Averages hide outliers. The claim was wrong, so the budget changed
	// rather than the claim being softened.
	it("does NOT catch one bloated component by average alone", () => {
		const r = evaluate({
			totalGzBytes: 79812,
			cssGzBytes: 67231 + 12 * 1024,
			componentCount: 60,
		});
		expect(r.ok).toBe(true);
	});

	it("catches one bloated component by the single-component ceiling", () => {
		const r = evaluate({
			...TODAY,
			largestComponentGzBytes: 18 * 1024,
			largestComponentName: "Sprawl",
		});
		expect(r.ok).toBe(false);
		expect(r.failures.join(" ")).toContain("Sprawl ships 18.0 KB");
		// The message says why the total and the average both stayed green,
		// so a reader is not left thinking the gate contradicts itself.
		expect(r.failures.join(" ")).toContain("An average cannot catch this");
	});

	it("still fails a systemic drift by average, which an outlier check cannot see", () => {
		// Every component growing 30% is invisible to a max and obvious to
		// an average. The two readings catch different failures, which is the
		// case for keeping both.
		const r = evaluate({
			totalGzBytes: 79812,
			cssGzBytes: Math.round(67231 * 1.3),
			componentCount: 59,
			largestComponentGzBytes: 11 * 1024,
			largestComponentName: "InstrumentViewport",
		});
		expect(r.ok).toBe(false);
		expect(r.failures.join(" ")).toContain("per component");
	});

	it("omits the largest reading entirely when it was not measured", () => {
		// Absent is not zero. A caller that cannot measure per-component
		// sizes must not have a fabricated 0 KB reported as a pass.
		const r = evaluate(TODAY);
		expect(r.readings.some((x) => x.name.startsWith("largest"))).toBe(false);
	});

	// The argument for splitting the budget, as a test: the library at the
	// era the 50KB figure was written passes BOTH numbers. It did not become
	// wasteful, it became larger, and a total-only budget could not say so.
	it("passes the library as it was when the old 50KB figure was written", () => {
		const r = evaluate({ totalGzBytes: 47890, cssGzBytes: 35309, componentCount: 31 });
		expect(r.ok).toBe(true);
		// Same efficiency then as now, within rounding.
		const then = 35309 / 31 / 1024;
		const now = TODAY.cssGzBytes / TODAY.componentCount / 1024;
		expect(Math.abs(then - now)).toBeLessThan(0.05);
	});

	// A measurement of zero is a broken measurement, not a very good result.
	// This gate exists because a budget nobody enforced reported nothing;
	// reporting success having measured nothing is the same failure.
	it("fails a measurement of zero bytes rather than celebrating it", () => {
		const r = evaluate({ ...TODAY, totalGzBytes: 0, cssGzBytes: 0 });
		expect(r.ok).toBe(false);
		expect(r.failures[0]).toContain("nothing was actually checked");
	});

	it("fails a zero component count rather than dividing by it", () => {
		const r = evaluate({ ...TODAY, componentCount: 0 });
		expect(r.ok).toBe(false);
		expect(r.failures[0]).toContain("nothing was actually checked");
		// Not NaN or Infinity leaking into a reading.
		expect(r.readings).toEqual([]);
	});

	it("takes a caller's budget, so the thresholds are testable without editing them", () => {
		expect(evaluate(TODAY, { totalGzKb: 10, cssKbPerComponent: 10 }).ok).toBe(false);
	});
});

describe("BUDGET", () => {
	// Headroom is the difference between a budget and a tripwire. A limit
	// sitting on the measurement fails on the next whitespace change and gets
	// switched off, which is how the last one died.
	it("leaves real headroom above the current measurement", () => {
		const totalKb = TODAY.totalGzBytes / 1024;
		const perComponent = TODAY.cssGzBytes / TODAY.componentCount / 1024;
		expect(BUDGET.totalGzKb).toBeGreaterThan(totalKb);
		expect(BUDGET.cssKbPerComponent).toBeGreaterThan(perComponent);
	});

	// And not so much headroom that it stops being a budget. A ceiling at
	// twice the measurement permits a doubling without a single failure.
	it("does not leave so much headroom that it permits a doubling", () => {
		const totalKb = TODAY.totalGzBytes / 1024;
		const perComponent = TODAY.cssGzBytes / TODAY.componentCount / 1024;
		expect(BUDGET.totalGzKb).toBeLessThan(totalKb * 1.25);
		expect(BUDGET.cssKbPerComponent).toBeLessThan(perComponent * 1.5);
		// The largest-component ceiling tracks InstrumentViewport, which is a
		// symptom of its nine unextracted foreign blocks rather than a
		// baseline. This assertion is what keeps the ceiling near the
		// measurement in BOTH directions: extract the blocks and it fails
		// until somebody lowers it, and raise it carelessly and it fails now.
		//
		// The anchor moved 11.2 -> 12.11 when the dark cascade gained the
		// heading, lead, title, link and value roles after a card shipped at
		// 1.23:1. It fired on that change, which is why the raise is
		// documented in BUDGET rather than silent. Anchor updated rather than
		// the ratio loosened: widening the tolerance would retire the guard
		// while appearing to keep it.
		expect(BUDGET.cssKbLargestComponent).toBeLessThan(12.11 * 1.15);
	});
});

describe("summarize", () => {
	it("prints every reading with its share of the limit, passing or failing", () => {
		// The percentage is what tells a reader whether to act before the
		// gate turns red, which a bare pass/fail never does.
		const r = summarize(evaluate(TODAY));
		expect(r.ok).toBe(true);
		expect(r.text).toContain("total artifact");
		expect(r.text).toContain("css per component");
		expect(r.text).toMatch(/\d+%/);
	});

	it("names both remedies on failure, so the fix is not just 'raise it'", () => {
		const r = summarize(evaluate({ ...TODAY, totalGzBytes: 95 * 1024 }));
		expect(r.ok).toBe(false);
		expect(r.text).toContain("in this commit, with the reason");
		expect(r.text).toContain("or make the artifact smaller");
	});
});
