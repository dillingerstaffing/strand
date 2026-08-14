import { describe, expect, it } from "vitest";
import { extractStrandTokens, tokenExistsIn } from "../migration-staleness.mjs";

// The checker reads migration guides and asserts every Strand token they name
// still exists. Its whole value is that a failure means a guide is lying to a
// consumer, so a false positive is worse than useless: it trains readers to
// ignore the gate, and the only way to quiet it is to grandfather real drift
// into the baseline alongside the noise.

const CSS = `
.strand-btn { color: red }
.strand-btn--primary { color: blue }
.strand-progress__fill { width: 0 }
.strand-ref-shell { display: grid }
.strand-ref-header__title { font-size: 2rem }
.strand-grid--cols-2 { grid-template-columns: repeat(2, 1fr) }
:root { --strand-gray-500: #5D6E81; }
`;

const SCSS = `
$strand-grey: #5D6E81;           // --strand-gray-500
$strand-black: #0F192A;          // --strand-blue-abyss
$strand-radius-small: 4px;
`;

describe("extractStrandTokens", () => {
	it("keeps the $ prefix on a Sass variable so it is not mistaken for a class", () => {
		const tokens = extractStrandTokens("| `$strand-grey` | `#5D6E81` |");
		expect([...tokens]).toContain("$strand-grey");
		expect([...tokens]).not.toContain("strand-grey");
	});

	it("keeps the -- prefix on a custom property", () => {
		const tokens = extractStrandTokens("Use `--strand-gray-500` for secondary text.");
		expect([...tokens]).toContain("--strand-gray-500");
	});

	it("keeps the trailing wildcard on a family reference", () => {
		const tokens = extractStrandTokens("Strand ships a `strand-ref-*` primitive family.");
		expect([...tokens]).toContain("strand-ref-*");
		expect([...tokens]).not.toContain("strand-ref");
	});

	it("still extracts a plain class name", () => {
		const tokens = extractStrandTokens("Replace `btn` with `strand-btn strand-btn--primary`.");
		expect([...tokens]).toContain("strand-btn");
		expect([...tokens]).toContain("strand-btn--primary");
	});

	it("ignores tokens outside code spans, which are prose", () => {
		expect([...extractStrandTokens("The strand-btn class is nice.")]).toEqual([]);
	});

	it("ignores a code span containing a path, which is a file reference", () => {
		expect([...extractStrandTokens("See `packages/tokens/strand-thing.css`.")]).toEqual([]);
	});
});

describe("tokenExistsIn", () => {
	const sources = { css: CSS, scss: SCSS };

	it("resolves a Sass variable against the Bulma variables file, not the css bundle", () => {
		// This is the false positive that made the gate unpassable: a Sass
		// variable never appears in the built CSS, so checking it there always
		// reports stale however healthy the Bulma layer is.
		expect(tokenExistsIn("$strand-grey", sources)).toBe(true);
		expect(tokenExistsIn("$strand-black", sources)).toBe(true);
	});

	it("reports a Sass variable that genuinely no longer exists", () => {
		expect(tokenExistsIn("$strand-removed", sources)).toBe(false);
	});

	// A consumer-settable knob is never DEFINED by the library -- that is what
	// makes it settable -- and is always read with a fallback. Before this,
	// only a bare `var(--x)` counted, so every such property read as stale.
	// It stayed hidden because the built stylesheet carried source comments
	// and one of them documented the property with a literal `--x:` in a
	// worked example, so the check was matching prose.
	it("finds a custom property that is only ever read with a fallback", () => {
		const css = ".a { top: var(--strand-ref-sticky-top, 0); }";
		expect(tokenExistsIn("--strand-ref-sticky-top", { css, scss: "" })).toBe(true);
	});

	it("finds a custom property read with a nested var() fallback", () => {
		const css = ".a { inline-size: var(--strand-dialog-inline-size, min(560px, 100%)); }";
		expect(tokenExistsIn("--strand-dialog-inline-size", { css, scss: "" })).toBe(true);
	});

	it("still finds a custom property that is defined outright", () => {
		expect(
			tokenExistsIn("--strand-blue-primary", { css: ":root { --strand-blue-primary: #3B8EF6; }", scss: "" }),
		).toBe(true);
	});

	it("still reports a custom property nothing defines or reads", () => {
		const css = ".a { top: var(--strand-ref-sticky-top, 0); }";
		expect(tokenExistsIn("--strand-gone", { css, scss: "" })).toBe(false);
	});

	it("does not accept a DIFFERENT property that merely shares a prefix", () => {
		// `var(--strand-dialog-inline-size-extra, 0)` must not satisfy a lookup
		// for `--strand-dialog-inline-size`, which a bare substring match would.
		const css = ".a { inline-size: var(--strand-dialog-inline-size-extra, 0); }";
		expect(tokenExistsIn("--strand-dialog-inline-size", { css, scss: "" })).toBe(false);
	});

	it("resolves a family wildcard against any member of the family", () => {
		expect(tokenExistsIn("strand-ref-*", sources)).toBe(true);
	});

	it("reports a family wildcard with no members", () => {
		expect(tokenExistsIn("strand-ghost-*", sources)).toBe(false);
	});

	it("resolves a custom property declared in the css", () => {
		expect(tokenExistsIn("--strand-gray-500", sources)).toBe(true);
		expect(tokenExistsIn("--strand-gray-999", sources)).toBe(false);
	});

	it("resolves an exact class and rejects one that only prefixes another", () => {
		expect(tokenExistsIn("strand-btn", sources)).toBe(true);
		expect(tokenExistsIn("strand-bt", sources)).toBe(false);
	});

	it("resolves a base class through its BEM family", () => {
		expect(tokenExistsIn("strand-progress", sources)).toBe(true);
	});

	it("resolves a numeric-variant family shorthand", () => {
		expect(tokenExistsIn("strand-grid--cols", sources)).toBe(true);
	});
});
