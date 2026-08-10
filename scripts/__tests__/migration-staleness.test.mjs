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
