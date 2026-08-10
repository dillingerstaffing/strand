import { describe, expect, it } from "vitest";
import {
	auditRule,
	contrastRatio,
	darkContextClasses,
	parsePalette,
	parseRules,
	thresholdFor,
} from "../contrast-check.mjs";

// The check is only worth having if it is precise in BOTH directions. A missed
// failure ships unreadable text; a false positive gets silenced, and silencing
// is how `strand-card--elevated` stayed hidden inside the staleness baseline
// for as long as it did.

const PALETTE = parsePalette(`
:root {
  --strand-gray-100: #F1F6F9;
  --strand-gray-400: #94A5B8;
  --strand-gray-500: #5D6E81;
  --strand-gray-600: #475769;
  --strand-blue-primary: #3B8EF6;
  --strand-blue-deep: #1D5AD8;
  --strand-on-blue-primary: #FFFFFF;
  --strand-instrument-text-primary: #FFFFFF;
}
`);

const audit = (selector, body, dark = new Set()) =>
	auditRule({ selector, body }, PALETTE, dark);

describe("contrastRatio", () => {
	it("matches the WCAG reference value for black on white", () => {
		expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
	});

	it("is symmetric, since the ratio does not care which is text", () => {
		expect(contrastRatio("#5D6E81", "#FFFFFF")).toBeCloseTo(
			contrastRatio("#FFFFFF", "#5D6E81"),
			10
		);
	});
});

describe("thresholdFor", () => {
	it("treats text with no declared size as small, since body is 16px", () => {
		expect(thresholdFor({ px: null, bold: false })).toBe(4.5);
	});

	it("treats 24px and above as large text", () => {
		expect(thresholdFor({ px: 24, bold: false })).toBe(3.0);
		expect(thresholdFor({ px: 23.9, bold: false })).toBe(4.5);
	});

	it("lets bold text reach the large threshold earlier, at 18.66px", () => {
		expect(thresholdFor({ px: 19, bold: true })).toBe(3.0);
		expect(thresholdFor({ px: 19, bold: false })).toBe(4.5);
	});
});

describe("auditRule catches real failures", () => {
	it("flags a fill-tier color used as body text", () => {
		const findings = audit(".strand-link", "color: var(--strand-blue-primary);");
		expect(findings.length).toBeGreaterThan(0);
		expect(findings[0].ratio).toBeCloseTo(3.29, 1);
	});

	it("flags a color that passes on white but fails on the recessed surface", () => {
		// The exact blind spot that let gray-500 sit at 4.487:1 in the spec:
		// quoting only the friendliest surface hides the binding one.
		const findings = audit(".x", "color: var(--strand-gray-400);");
		expect(findings.map((f) => f.surface)).toContain("surface-recessed");
	});

	it("flags small text even when the same color would pass at display size", () => {
		const small = audit(".x", "font-size: var(--strand-text-xs); color: var(--strand-blue-primary);");
		expect(small.length).toBeGreaterThan(0);
	});
});

describe("auditRule does not cry wolf", () => {
	it("passes a text-tier color on every sanctioned surface", () => {
		expect(audit(".strand-link", "color: var(--strand-blue-deep);")).toEqual([]);
	});

	it("ignores a rule that paints its own background", () => {
		// White on a blue button is not white on white.
		expect(
			audit(".strand-btn", "background: var(--strand-blue-primary); color: #FFFFFF;")
		).toEqual([]);
	});

	it("ignores an --strand-on-* token, whose pairing is verified at the token layer", () => {
		expect(audit(".strand-badge__indicator", "color: var(--strand-on-blue-primary);")).toEqual([]);
	});

	it("ignores instrument tokens, which are never painted on a light surface", () => {
		expect(audit(".strand-nav__title", "color: var(--strand-instrument-text-primary);")).toEqual([]);
	});

	it("ignores a dark-cabinet class even when its name says nothing about dark", () => {
		const dark = new Set(["strand-search-bar__action"]);
		expect(
			audit(".strand-search-bar__action", "color: var(--strand-gray-100);", dark)
		).toEqual([]);
	});

	it("still audits a light island nested inside the dark cabinet", () => {
		// DL 9.6: .strand-detail-panel is a light surface inside the dark
		// viewport, so its text pairs against light and stays in scope.
		const dark = new Set(["strand-link"]);
		const findings = audit(
			".strand-detail-panel .strand-link",
			"color: var(--strand-blue-primary);",
			dark
		);
		expect(findings.length).toBeGreaterThan(0);
	});

	it("ignores a specimen surface, which exists to display the token", () => {
		expect(audit(".strand-swatch__label", "color: var(--strand-gray-400);")).toEqual([]);
	});

	it("treats a clamp() headline as display-sized", () => {
		expect(
			audit(".strand-headline", "font-size: clamp(2.5rem, 5vw, 5rem); color: var(--strand-gray-500);")
		).toEqual([]);
	});

	it("ignores a rule that sets no color at all", () => {
		expect(audit(".x", "margin: 0; padding: 4px;")).toEqual([]);
	});

	it("does not mistake border-color for a text color", () => {
		// `border-bottom-color: var(...)` contains `color: var(...)` as a
		// substring; anchoring on the declaration start is what prevents a
		// border from being audited as if it were text.
		expect(audit(".strand-tabs__tab", "border-bottom-color: var(--strand-blue-primary);")).toEqual([]);
	});
});

describe("darkContextClasses", () => {
	it("derives the dark family from the cabinet stylesheet", () => {
		const classes = darkContextClasses(`
      .strand-search-bar__action { color: red }
      .strand-cluster-marker { color: red }
    `);
		expect(classes.has("strand-search-bar__action")).toBe(true);
		expect(classes.has("strand-cluster-marker")).toBe(true);
	});

	it("excludes the light islands so they stay auditable", () => {
		const classes = darkContextClasses(".strand-detail-panel__source { color: red }");
		expect(classes.has("strand-detail-panel__source")).toBe(false);
	});

	it("does not treat a viewport-scoped OVERRIDE as a dark-only component", () => {
		// `.strand-instrument-viewport .strand-log__text` gives an on-dark colour
		// to a class whose real definition lives in static.css. Marking the class
		// dark-only would skip that light rule -- which is how the log and
		// bar-chart readouts shipped dark-on-dark once already.
		const classes = darkContextClasses(`
      .strand-instrument-viewport .strand-log__text { color: red }
      .strand-body--instrument .strand-bar-chart__amount { color: red }
      .strand-cluster-marker { color: red }
    `);
		expect(classes.has("strand-log__text")).toBe(false);
		expect(classes.has("strand-bar-chart__amount")).toBe(false);
		// A genuinely dark-only component, declared unscoped in that file, still counts.
		expect(classes.has("strand-cluster-marker")).toBe(true);
	});
});

describe("parseRules", () => {
	it("separates selector from body and collapses whitespace", () => {
		const rules = parseRules(".a,\n.b { color: red; }");
		expect(rules[0].selector).toBe(".a, .b");
		expect(rules[0].body).toContain("color: red");
	});
});
