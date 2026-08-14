/*! Strand UI | MIT License | dillingerstaffing.com */

/**
 * Strip source commentary from the SHIPPED stylesheet, keeping `/*!` banners.
 *
 * WHY THIS EXISTS, measured rather than assumed. The concatenated bundle was
 * 344,311 raw bytes, of which 164,997 (48%) were comments. Gzip does not
 * rescue it, because prose is exactly what gzip handles worst relative to
 * repeated CSS tokens: 85,927 bytes gzipped as written against 23,669 with
 * the comments removed. Source commentary was 62,258 gzipped bytes, or 72%
 * of the CSS every consumer of every Strand-built page downloads.
 *
 * It went unnoticed because `collectCss()` in vite.config.ts readFileSync's
 * the source files and concatenates them, so this stylesheet never passes
 * through Vite's CSS pipeline and nothing ever minified it. The bundle budget
 * was reading comment volume and calling it library weight.
 *
 * THE COMMENTS ARE NOT THE PROBLEM AND MUST NOT BE TRIMMED. They are how this
 * library records why a declaration is the value it is, and a reader of the
 * SOURCE still gets every word. Only the artifact loses them, which is the
 * one audience that was never reading them.
 *
 * `/*!` survives, which is the convention every minifier honours for a
 * license banner, and the MIT notice at the top of each file is one.
 *
 * Deliberately comments ONLY: no whitespace collapsing, no declaration
 * rewriting. The diff a reviewer has to trust stays "prose removed", the
 * artifact stays readable in devtools, and nothing this function does can
 * change what a browser renders.
 *
 * Lives in its own module rather than inside vite.config.ts so it can be
 * unit-tested without a jsdom test importing Vite.
 *
 * @param {string} css
 * @returns {string}
 */
export function stripComments(css) {
	return String(css)
		.replace(/\/\*(?!!)[\s\S]*?\*\//g, "")
		// Concatenation leaves the removed blocks behind as runs of blank lines.
		.replace(/^[ \t]+$/gm, "")
		.replace(/\n{3,}/g, "\n\n");
}
