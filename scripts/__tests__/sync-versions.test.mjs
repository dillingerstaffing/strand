import { describe, expect, it } from "vitest";
import { BANNER_RE, stampBanner } from "../sync-versions.mjs";

// The CSS banners are the version a consumer sees when they open a synced file,
// and they had drifted to v0.5.0 and v0.2.0 on a 0.27.0 package: frozen at
// whatever release first wrote them, because nothing kept them current. A
// banner that lies is worse than no banner, since downstream tooling reads it.

describe("stampBanner", () => {
	it("updates a stale version in place", () => {
		expect(
			stampBanner("/*! Strand v0.5.0 | MIT License | dillingerstaffing.com */", "0.27.1")
		).toBe("/*! Strand v0.27.1 | MIT License | dillingerstaffing.com */");
	});

	it("keeps the product name, which differs between packages", () => {
		expect(
			stampBanner("/*! Strand UI v0.5.0 | MIT License | dillingerstaffing.com */", "1.0.0")
		).toBe("/*! Strand UI v1.0.0 | MIT License | dillingerstaffing.com */");
	});

	it("inserts a version into a banner that never had one", () => {
		// fonts.css shipped bannerless-of-version in 0.27.0, which forced a
		// consumer's governance check to special-case it.
		expect(
			stampBanner("/*! Strand fonts | MIT License | dillingerstaffing.com", "0.27.1")
		).toBe("/*! Strand fonts v0.27.1 | MIT License | dillingerstaffing.com");
	});

	it("stamps only the banner, never a version mentioned in the body", () => {
		const css = `/*! Strand v0.5.0 | MIT License | dillingerstaffing.com */

/* Superseded in v0.5.0, kept for reference. */
.a { color: red }`;
		const out = stampBanner(css, "0.27.1");
		expect(out).toContain("/*! Strand v0.27.1 |");
		expect(out).toContain("Superseded in v0.5.0");
	});

	it("stamps a banner embedded in a JS string literal", () => {
		// strand-ui's bundle banner lives inside vite.config.ts, not in a css file.
		expect(
			stampBanner(
				'      let allCss = "/*! Strand UI v0.5.0 | MIT License | dillingerstaffing.com */\\n\\n";',
				"0.27.1"
			)
		).toContain("Strand UI v0.27.1 | MIT License");
	});

	it("leaves a file with no banner untouched", () => {
		const css = ".a { color: red }";
		expect(stampBanner(css, "0.27.1")).toBe(css);
	});

	it("is idempotent, so re-running a release does not churn the tree", () => {
		const once = stampBanner("/*! Strand v0.5.0 | MIT License | x */", "0.27.1");
		expect(stampBanner(once, "0.27.1")).toBe(once);
	});

	it("only stamps the first banner, so a concatenated bundle keeps one header", () => {
		const bundle = `/*! Strand UI v0.5.0 | MIT License | x */

/*! Strand UI | MIT License | x */
.a { color: red }`;
		const out = stampBanner(bundle, "0.27.1");
		expect(out.match(/v0\.27\.1/g)).toHaveLength(1);
	});
});

describe("BANNER_RE", () => {
	it("does not match a banner belonging to some other project", () => {
		expect(BANNER_RE.test("/*! Bootstrap v5.3.0 | MIT License */")).toBe(false);
	});
});
