// Unit tests for the pure half of the release ceremony.
//
// The bug these exist for is invisible at release time and only surfaces in a
// consumer's lockfile weeks later. `pnpm release` hardcoded a patch bump, so
// every component added after the script was written would have shipped as a
// patch, while every component added BEFORE it took a minor by hand
// (ActionDock 0.35.0, CommandPalette 0.36.0). The ceremony written to remove
// mechanical work had quietly made the versioning wrong, and nothing in its
// output said so: a successful release looks identical either way.

import { describe, expect, it } from "vitest";
import {
	bumpLevelFrom,
	nextVersion,
	releaseBlockingUntracked,
} from "../release.mjs";

describe("nextVersion", () => {
	it("defaults to a patch, because most releases are fixes", () => {
		expect(nextVersion("0.36.9")).toBe("0.36.10");
	});

	it("bumps a patch without touching the minor", () => {
		expect(nextVersion("0.36.9", "patch")).toBe("0.36.10");
	});

	// The case the flag exists for: new public surface is a minor, and the
	// patch component resets rather than carrying over.
	it("bumps a minor and resets the patch", () => {
		expect(nextVersion("0.36.10", "minor")).toBe("0.37.0");
	});

	it("bumps a major and resets both", () => {
		expect(nextVersion("0.37.4", "major")).toBe("1.0.0");
	});

	it("carries a two-digit patch correctly rather than lexically", () => {
		// String comparison would put 0.36.9 after 0.36.10; the arithmetic
		// must be numeric.
		expect(nextVersion("0.36.19")).toBe("0.36.20");
	});

	it("refuses a version it cannot parse rather than inventing one", () => {
		// Silently returning NaN.NaN.NaN would write a broken version into
		// five package.json files before anything noticed.
		expect(() => nextVersion("0.36")).toThrow(/cannot parse/);
		expect(() => nextVersion("1.2.x")).toThrow(/cannot parse/);
		expect(() => nextVersion("")).toThrow(/cannot parse/);
	});

	it("refuses an unknown level rather than falling back to patch", () => {
		// A typo'd flag that silently patched would be the original defect
		// wearing a different hat.
		expect(() => nextVersion("0.36.9", "mnior")).toThrow(/unknown bump level/);
	});
});

describe("bumpLevelFrom", () => {
	it("is patch when nothing is asked for", () => {
		expect(bumpLevelFrom(["--msg", "fix(strand): thing (vX.Y.Z)"])).toBe("patch");
	});

	it("reads each level flag", () => {
		expect(bumpLevelFrom(["--minor"])).toBe("minor");
		expect(bumpLevelFrom(["--major"])).toBe("major");
		expect(bumpLevelFrom(["--patch"])).toBe("patch");
	});

	// Two levels at once is a mistake rather than a precedence question, so
	// resolving it by some rule would ship the version the author did not
	// mean and say nothing.
	it("refuses two levels at once instead of picking one", () => {
		expect(() => bumpLevelFrom(["--minor", "--major"])).toThrow(/pick one/);
	});

	it("is not confused by a level word appearing inside the message", () => {
		expect(bumpLevelFrom(["--msg", "fix(strand): a minor adjustment (vX.Y.Z)"])).toBe(
			"patch",
		);
	});
});

describe("releaseBlockingUntracked", () => {
	// The defect this function exists for actually shipped: v0.37.0 published
	// an index.ts re-exporting SearchField from a directory that was never
	// committed, because `git add -u` stages modifications and cannot add a
	// new file. The local build passed the whole way, since it reads the
	// working tree; only a fresh clone would have failed.
	it("catches a new component whose source was never staged", () => {
		expect(
			releaseBlockingUntracked([
				"packages/strand-ui/src/components/SearchField/SearchField.tsx",
				"packages/strand-ui/src/components/SearchField/index.ts",
			]),
		).toHaveLength(2);
	});

	it("catches a new file in any consumer package, not just the canonical one", () => {
		expect(
			releaseBlockingUntracked([
				"packages/strand-vue/src/components/SearchField/SearchField.vue",
				"packages/strand-svelte/src/components/SearchField/SearchField.svelte",
			]),
		).toHaveLength(2);
	});

	it("catches a new script or its test", () => {
		expect(releaseBlockingUntracked(["scripts/__tests__/release.test.mjs"])).toEqual([
			"scripts/__tests__/release.test.mjs",
		]);
	});

	// The other half of being correct. Build output and scratch files are
	// untracked constantly, and a guard that blocked on those would be
	// switched off within a day, taking the real check with it.
	it("ignores build output, scratch files and editor droppings", () => {
		expect(
			releaseBlockingUntracked([
				"packages/strand-ui/dist/css/strand-ui.css",
				"node_modules/foo/index.js",
				"test-results/report.html",
				".DS_Store",
				"notes.md",
			]),
		).toEqual([]);
	});

	it("does not fire on a package path outside src", () => {
		expect(releaseBlockingUntracked(["packages/strand-ui/README.md"])).toEqual([]);
	});

	it("is empty for a clean tree", () => {
		expect(releaseBlockingUntracked([])).toEqual([]);
	});
});

describe("the version placeholder", () => {
	// The token, not the parenthetical. Requiring the exact string "(vX.Y.Z)"
	// with its own brackets disagreed with this repo's own commit convention,
	// where the version sits inside a larger parenthetical alongside a gap
	// reference: "(v0.35.0, gap #66)". Under the old form a correctly-written
	// message skipped substitution silently and announced a version that was
	// never released -- the exact failure the guard exists to prevent.
	const stamp = (msg, v) => msg.replaceAll("vX.Y.Z", `v${v}`);

	it("substitutes a bare token", () => {
		expect(stamp("fix(strand): thing (vX.Y.Z)", "0.38.0")).toBe(
			"fix(strand): thing (v0.38.0)",
		);
	});

	it("substitutes inside a larger parenthetical, which is the house form", () => {
		expect(stamp("feat(strand): thing (vX.Y.Z, gaps #73-#74)", "0.38.0")).toBe(
			"feat(strand): thing (v0.38.0, gaps #73-#74)",
		);
	});

	it("leaves a message with no placeholder untouched, which the guard then refuses", () => {
		const msg = "feat(strand): thing (v0.37.0)";
		expect(stamp(msg, "0.38.0")).toBe(msg);
		expect(msg.includes("vX.Y.Z")).toBe(false);
	});
});
