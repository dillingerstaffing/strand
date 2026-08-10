import { describe, expect, it } from "vitest";
import { buildFontFaceCss, parseGoogleFontCss } from "../vendor-fonts.mjs";

// Synthetic fixtures modelled on the shape Google Fonts actually returns:
// a subset name in a comment, then an @font-face whose src is a bare url()
// followed by format('woff2'). Both details are easy to parse wrongly.
const INTER_CSS = `/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/aaa.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/bbb.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/ccc.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131;
}
`;

describe("parseGoogleFontCss", () => {
	it("returns one face per subset, in source order", () => {
		const faces = parseGoogleFontCss(INTER_CSS);
		expect(faces.map((f) => f.subset)).toEqual(["cyrillic-ext", "latin-ext", "latin"]);
	});

	it("captures the woff2 url without swallowing the format() that follows it", () => {
		const faces = parseGoogleFontCss(INTER_CSS);
		expect(faces[2].url).toBe("https://fonts.gstatic.com/s/inter/v20/ccc.woff2");
		expect(faces[2].url).not.toContain("format");
	});

	it("captures the full unicode-range including every comma-separated part", () => {
		const faces = parseGoogleFontCss(INTER_CSS);
		expect(faces[1].unicodeRange).toBe("U+0100-02BA, U+02BD-02C5");
	});

	it("captures a variable weight range as a range, not a single weight", () => {
		const faces = parseGoogleFontCss(INTER_CSS);
		expect(faces[0].weight).toBe("300 600");
	});

	it("reads the family name from the block rather than assuming one", () => {
		const faces = parseGoogleFontCss(INTER_CSS);
		expect(faces[0].family).toBe("Inter");
	});

	it("handles a quoted url, which the API is free to start emitting", () => {
		const css = `/* latin */
@font-face {
  font-family: 'X';
  font-weight: 400;
  src: url('https://example.test/x.woff2') format('woff2');
  unicode-range: U+0000-00FF;
}`;
		expect(parseGoogleFontCss(css)[0].url).toBe("https://example.test/x.woff2");
	});

	it("skips a block with no preceding subset comment rather than mislabelling it", () => {
		const css = `@font-face {
  font-family: 'X';
  font-weight: 400;
  src: url(https://example.test/x.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}`;
		expect(parseGoogleFontCss(css)).toEqual([]);
	});

	it("returns nothing for css containing no font faces", () => {
		expect(parseGoogleFontCss("/* latin */\nbody { color: red }")).toEqual([]);
	});
});

describe("buildFontFaceCss", () => {
	const faces = [
		{
			family: "Inter",
			subset: "latin",
			weight: "300 600",
			unicodeRange: "U+0000-00FF",
			file: "inter-latin.woff2",
		},
		{
			family: "JetBrains Mono",
			subset: "latin-ext",
			weight: "400 600",
			unicodeRange: "U+0100-02BA",
			file: "jetbrains-mono-latin-ext.woff2",
		},
	];

	it("points every src at the sibling fonts directory, never at a CDN", () => {
		const css = buildFontFaceCss(faces);
		expect(css).toContain("url('../fonts/inter-latin.woff2')");
		expect(css).not.toContain("gstatic");
		expect(css).not.toContain("googleapis");
		expect(css).not.toContain("http");
	});

	it("gives every face an explicit font-display: swap", () => {
		const css = buildFontFaceCss(faces);
		const blocks = css.match(/@font-face\s*\{[^}]*\}/g);
		expect(blocks).toHaveLength(2);
		for (const block of blocks) {
			// Without this the face defaults to auto, which Chrome treats as
			// block: paint stalls for up to 3s while the font loads.
			expect(block).toMatch(/font-display:\s*swap/);
		}
	});

	it("preserves the unicode-range so a subset is only fetched when needed", () => {
		const css = buildFontFaceCss(faces);
		expect(css).toContain("unicode-range: U+0000-00FF;");
		expect(css).toContain("unicode-range: U+0100-02BA;");
	});

	it("carries the variable weight range through to the declaration", () => {
		const css = buildFontFaceCss(faces);
		expect(css).toContain("font-weight: 300 600;");
		expect(css).toContain("font-weight: 400 600;");
	});

	it("quotes multi-word family names so the declaration stays valid", () => {
		const css = buildFontFaceCss(faces);
		expect(css).toContain("font-family: 'JetBrains Mono';");
	});
});
