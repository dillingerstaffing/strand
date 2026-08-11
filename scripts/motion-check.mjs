#!/usr/bin/env node
// Motion check: the browser tier for MOTION.
//
// Sibling of layout-check.mjs, not a subset of it, and the distinction is the
// reason this file exists. The layout tier measures BOX GEOMETRY: it would
// happily confirm that a Settle region does not change size while saying
// nothing at all about whether it animated. Geometry and motion are different
// measurements and each instrument is only competent at its own question. An
// earlier draft of gap #65 credited the layout tier with covering this; it does
// not, and that mistake is on the record so it is not repeated.
//
// jsdom is blinder still: it runs no animations whatsoever, so a primitive
// whose entire job is to animate would pass every unit test in this repository
// while doing nothing. That is the same shape as the Reserve collapse bug in
// gap #63 -- a fully published primitive that no test here could evaluate --
// and it is why this tier is being added at the same time as the primitive
// rather than after a consumer reports it.
//
// The probe is document.getAnimations() and the timing events the browser
// emits. Not a poll: a 150ms animation is comfortably missed by polling, and a
// probe that misses the motion is indistinguishable in the report from a
// primitive that has none.
//
// Like every other tier here: an instrument that cannot run FAILS rather than
// skips, and a run that evaluated nothing exits non-zero. "0 of 0 cases failed"
// is how a measurement aimed slightly wrong announces success.
//
// Usage: pnpm test:motion

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const CSS_PATH = resolve(REPO_ROOT, "packages/strand-ui/dist/css/strand-ui.css");
const TOKENS_PATH = resolve(REPO_ROOT, "packages/tokens/css/tokens.css");

// Properties whose animation forces layout. Design language 6.3 rules these
// out for the framerate cost and 6.8 lists animating them as an anti-pattern:
// a height animation is a layout shift with an easing curve on it, and it is
// scored as one.
//
// `visibility` is deliberately absent: it preserves layout, and Reserve rides
// it on the opacity transition so the faded layer leaves the accessibility
// tree. Calling it a layout property would fail the library's own correct
// design.
const LAYOUT_PROPERTIES = new Set([
	"width", "height", "block-size", "inline-size", "min-width", "min-height",
	"max-width", "max-height", "margin", "margin-top", "margin-right",
	"margin-bottom", "margin-left", "padding", "padding-top", "padding-right",
	"padding-bottom", "padding-left", "top", "right", "bottom", "left", "inset",
	"border-width", "font-size", "line-height", "flex-basis", "gap",
]);

// 6.9: a state change is user-initiated, so the motion CONFIRMS rather than
// introduces. duration-fast is 150ms and duration-normal is 250ms; past that
// it reads as the page being slow rather than as the action landing.
const MAX_STATE_CHANGE_MS = 250;

// ── The cases ──
//
// A primitive earns a case here only when its reason for existing is a
// statement about MOTION. Hover and focus transitions do not qualify: they are
// declarative, they are covered by the static tier reading the stylesheet, and
// they have no trigger worth reproducing. What qualifies is motion whose
// trigger is a DOM event, because that is the part a stylesheet cannot state
// and a reader cannot verify.

const CASES = [
	{
		name: "settle fades a newly inserted element in",
		// The whole primitive is JS-free on the premise that a keyframe
		// animation runs when an element enters the DOM. If that premise is
		// ever false, every consumer silently gets nothing.
		run: async (page) =>
			page.evaluate(async () => {
				const host = document.getElementById("host");
				const seen = new Promise((r) => {
					host.addEventListener("animationstart", (e) => r(e), { once: true });
					setTimeout(() => r(null), 1000);
				});
				const el = document.createElement("span");
				el.className = "strand-settle";
				el.textContent = "7 people";
				host.appendChild(el);
				const evt = await seen;
				if (!evt) return { fired: false };
				const anim = el.getAnimations()[0];
				const props = new Set();
				for (const kf of anim?.effect?.getKeyframes?.() || []) {
					for (const k of Object.keys(kf)) {
						if (["offset", "easing", "composite", "computedOffset"].includes(k)) continue;
						props.add(k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
					}
				}
				return {
					fired: true,
					name: evt.animationName,
					properties: [...props],
					durationMs: anim?.effect?.getTiming?.().duration ?? 0,
				};
			}),
		assert: (r) => {
			if (!r.fired) return "no animation fired on insertion; the primitive is inert";
			if (!r.properties.includes("opacity")) return `expected opacity, animated ${r.properties.join(", ")}`;
			const layout = r.properties.filter((p) => LAYOUT_PROPERTIES.has(p));
			if (layout.length) return `animated a layout property: ${layout.join(", ")}`;
			if (r.durationMs > MAX_STATE_CHANGE_MS)
				return `${r.durationMs}ms exceeds the ${MAX_STATE_CHANGE_MS}ms state-change ceiling`;
			return null;
		},
	},

	{
		name: "settle does not change the region's size (the Reserve boundary)",
		// The agreed division: Reserve owns the BOX, Settle owns the MOMENT.
		// Nothing but a paragraph in 6.9 currently stops someone adding a
		// height here to "fix" a jumpy consumer, and neither the motion probe
		// nor jsdom would notice. This is the assertion that stops them.
		run: async (page) =>
			page.evaluate(async () => {
				const host = document.getElementById("host");
				host.innerHTML = `<span id="a" class="strand-settle">7 people</span>`;
				const el = document.getElementById("a");
				const during = el.getBoundingClientRect().height;
				await el.getAnimations()[0]?.finished?.catch(() => {});
				const after = el.getBoundingClientRect().height;
				const bare = (() => {
					const b = document.createElement("span");
					b.textContent = "7 people";
					host.appendChild(b);
					const h = b.getBoundingClientRect().height;
					b.remove();
					return h;
				})();
				return { during, after, bare };
			}),
		assert: (r) => {
			if (Math.abs(r.during - r.after) > 0.5)
				return `height moved during the fade: ${r.during} -> ${r.after}`;
			if (Math.abs(r.after - r.bare) > 0.5)
				return `settle changed the box: ${r.after} vs ${r.bare} unstyled. Settle must not touch layout`;
			return null;
		},
	},

	{
		name: "identity is what triggers it (6.9.1): a replaced node refires, a patched one does not",
		// The contract the whole primitive rests on, measured in a browser
		// rather than reasoned about. A consumer who adds the class but not the
		// identity gets a primitive that looks installed and animates nothing,
		// which is the single most likely way to misuse this.
		run: async (page) =>
			page.evaluate(async () => {
				const host = document.getElementById("host");
				host.innerHTML = "";
				let refired = 0;
				host.addEventListener("animationstart", () => refired++);

				const el = document.createElement("span");
				el.className = "strand-settle";
				el.textContent = "6 people";
				host.appendChild(el);
				await new Promise((r) => setTimeout(r, 250));
				const afterInsert = refired;

				// Patch the text on the SAME node, which is what a framework does
				// when the identity did not change.
				el.textContent = "7 people";
				await new Promise((r) => setTimeout(r, 250));
				const afterPatch = refired;

				// Replace the node, which is what a changed identity produces.
				const next = document.createElement("span");
				next.className = "strand-settle";
				next.textContent = "8 people";
				el.replaceWith(next);
				await new Promise((r) => setTimeout(r, 250));
				const afterReplace = refired;

				return { afterInsert, afterPatch, afterReplace };
			}),
		assert: (r) => {
			if (r.afterInsert !== 1) return `insertion fired ${r.afterInsert} animations, expected 1`;
			if (r.afterPatch !== 1)
				return `patching text on the same node fired an animation; it must not, or every unrelated re-render re-announces`;
			if (r.afterReplace !== 2)
				return `replacing the node did not refire (${r.afterReplace}); 6.9.1's contract is broken and consumers get nothing on a value change`;
			return null;
		},
	},

	{
		name: "reduced motion removes the fade and leaves the element VISIBLE",
		// Two failures in one case, and the second is the one worth the browser.
		// The house habit of zeroing a duration would, with fill-mode `both`,
		// still apply the `from` frame -- leaving the element permanently at
		// opacity 0 for exactly the users who asked for less motion. A stylesheet
		// reader cannot tell those two resets apart. A browser can.
		reducedMotion: true,
		run: async (page) =>
			page.evaluate(async () => {
				const host = document.getElementById("host");
				host.innerHTML = "";
				let fired = 0;
				host.addEventListener("animationstart", () => fired++);
				const el = document.createElement("span");
				el.className = "strand-settle";
				el.textContent = "7 people";
				host.appendChild(el);
				await new Promise((r) => setTimeout(r, 250));
				return {
					emulationVerified: matchMedia("(prefers-reduced-motion: reduce)").matches,
					fired,
					opacity: getComputedStyle(el).opacity,
				};
			}),
		assert: (r) => {
			// Checked FIRST and treated as a failure rather than a skip. The
			// form a test author reaches for silently does nothing, the media
			// query never matches, and the run reports a perfect zero for a
			// sheet that animates exactly as much as before. That has already
			// cost this project two sessions; see design-language 6.7.
			if (!r.emulationVerified)
				return "reduced-motion emulation did not take; nothing measured under it can be trusted";
			if (r.fired !== 0) return `${r.fired} animations ran under reduced motion`;
			if (Number(r.opacity) !== 1)
				return `element is parked at opacity ${r.opacity}; the reset must remove the animation, not zero its duration`;
			return null;
		},
	},
];

async function main() {
	let chromium;
	try {
		({ chromium } = await import("playwright"));
	} catch {
		// Fails rather than skips, per the tier rule. A missing browser that
		// reports success is worse than no tier at all.
		console.error("motion-check: playwright is not installed. This tier cannot skip.");
		return 1;
	}

	const css = await readFile(CSS_PATH, "utf8");
	const tokens = await readFile(TOKENS_PATH, "utf8");
	const browser = await chromium.launch();
	let failures = 0;
	let ran = 0;

	try {
		for (const c of CASES) {
			const context = await browser.newContext(
				c.reducedMotion ? { reducedMotion: "reduce" } : {},
			);
			const page = await context.newPage();
			await page.setContent(
				`<!doctype html><style>${tokens}\n${css}</style><body><div id="host"></div></body>`,
			);
			const result = await c.run(page);
			const problem = c.assert(result);
			ran++;
			if (problem) {
				failures++;
				console.error(`FAIL  ${c.name}\n        ${problem}`);
			} else {
				console.log(`ok    ${c.name}`);
			}
			await context.close();
		}
	} finally {
		await browser.close();
	}

	if (ran === 0) {
		console.error("motion-check: no cases ran. An empty run is a failure, not a pass.");
		return 1;
	}
	console.log(`\n${ran} cases, ${failures} failed.`);
	return failures ? 1 : 0;
}

process.exit(await main());
