#!/usr/bin/env node
// One-command release ceremony: bump, verify, build, commit, push.
//
//   pnpm release --msg "fix(strand): what changed and why (vX.Y.Z)"
//
// Exists because the ceremony was measured at ~90 seconds of mechanical work
// per release performed by hand (five version bumps, targeted suites, build,
// layout tier, commit, push), and it sat on the critical path of every
// downstream consumer ship. The publish workflow's full browser matrix
// remains the exhaustive backstop; this runs the fast local tiers only.
//
// The version in the message is stamped for you: write (vX.Y.Z) literally
// and it is replaced with the bumped version, so the message can be written
// before the bump is computed.
//
// BUMP LEVEL. Patch is the default because most releases are fixes. Pass
// --minor when the release ADDS public surface -- a new component, a new
// utility class, a new prop -- and --major for a removal or a breaking
// change.
//
// This is not a preference. parity-manifest.json's own description says
// "Removing a primitive requires a major version bump", and every new
// component before this script existed took a minor by hand: ActionDock at
// 0.35.0, CommandPalette at 0.36.0. The script then hardcoded a patch bump,
// so the ceremony that was written to remove mechanical work quietly made
// every future component addition semver-wrong. SearchField was released as
// 0.36.10 by exactly that path and corrected to 0.37.0 in the next commit,
// which is what prompted the flag.
//
// A patch that adds a component is not harmless. A consumer pinned ~0.36.9
// receives new public API from a release that promised only fixes, and the
// next person reading the history cannot tell which releases changed the
// surface.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

/**
 * Untracked files that belong in the release.
 *
 * THE DEFECT THIS EXISTS FOR, because it shipped before it was caught:
 * the ceremony staged with `git add -u`, which stages modifications to
 * files git already knows and CANNOT add a new one. So a release that
 * introduced a component committed its EXPORT, its manifest entry and its
 * documentation, and left every source file of the component itself
 * untracked. v0.37.0 went out with `index.ts` re-exporting SearchField
 * from a directory that did not exist in the repository. The local build
 * passed throughout, because the local build reads the working tree; only
 * a fresh clone would have failed, which is to say CI and every consumer.
 *
 * `git add -u` was not a careless choice -- it is the safe form in a
 * shared checkout, where `git add -A` sweeps up whatever a neighbour left
 * lying around. It is simply the wrong form for a release, whose whole
 * job is to publish new files. So this refuses rather than widening the
 * add: the ceremony names what it is about to miss and stops, and the
 * author stages deliberately.
 *
 * Scoped to source and script paths on purpose. Build output, scratch
 * files and editor droppings are untracked all the time and must not
 * block a release; a new file under a package's `src` directory, or under
 * `scripts`, is almost never anything but part of the change being
 * released.
 */
export function releaseBlockingUntracked(untrackedPaths) {
	return untrackedPaths.filter(
		(p) => /^packages\/[^/]+\/src\//.test(p) || /^scripts\//.test(p),
	);
}

/**
 * The next version, given the current one and the requested level.
 *
 * Pure and exported so the arithmetic is testable without a git tree: the
 * failure this guards against (a new component shipped as a patch) is
 * invisible in a release's output and only shows up in a consumer's
 * lockfile weeks later.
 */
export function nextVersion(current, level = "patch") {
	const parts = current.split(".").map(Number);
	if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n) || n < 0)) {
		throw new Error(`release: cannot parse version "${current}"`);
	}
	const [maj, min, pat] = parts;
	if (level === "major") return `${maj + 1}.0.0`;
	if (level === "minor") return `${maj}.${min + 1}.0`;
	if (level === "patch") return `${maj}.${min}.${pat + 1}`;
	throw new Error(`release: unknown bump level "${level}"`);
}

/** Which level the flags ask for. Two levels at once is a mistake, not a
    precedence question, so it is refused rather than resolved. */
export function bumpLevelFrom(argv) {
	const asked = ["major", "minor", "patch"].filter((l) => argv.includes(`--${l}`));
	if (asked.length > 1) {
		throw new Error(`release: pick one of ${asked.map((a) => `--${a}`).join(", ")}`);
	}
	return asked[0] || "patch";
}

// Guard the impure shell so importing this file for its pure functions does
// not run a release.
const isEntry =
	process.argv[1] && process.argv[1].endsWith("release.mjs");

const args = process.argv.slice(2);
const msgIx = args.indexOf("--msg");
const msg = msgIx >= 0 ? args[msgIx + 1] : null;
if (isEntry && !msg) {
	console.error(
		'usage: pnpm release --msg "type(strand): subject (vX.Y.Z)" [--minor|--major]',
	);
	process.exit(1);
}

const run = (cmd, cmdArgs, opts = {}) =>
	execFileSync(cmd, cmdArgs, { stdio: "inherit", ...opts });
const out = (cmd, cmdArgs) => execFileSync(cmd, cmdArgs, { encoding: "utf8" }).trim();

const PKGS = [
	"package.json",
	"packages/strand-ui/package.json",
	"packages/strand-svelte/package.json",
	"packages/strand-vue/package.json",
	"packages/tokens/package.json",
];

function main() {
	// Refuse a tree with nothing to release: an accidental double invocation
	// would otherwise create an empty bump commit.
	if (out("git", ["status", "--porcelain"]) === "") {
		console.error("release: working tree is clean; nothing to release.");
		process.exit(1);
	}

	// Before anything is bumped: a new file that nobody staged is the one
	// failure this ceremony cannot recover from after the fact, because the
	// push is what makes it public.
	const untracked = out("git", ["ls-files", "--others", "--exclude-standard"])
		.split("\n")
		.filter(Boolean);
	const blocking = releaseBlockingUntracked(untracked);
	if (blocking.length) {
		console.error(
			"release: untracked source files would be left out of this release:",
		);
		for (const p of blocking) console.error(`  ${p}`);
		console.error(
			"\n  `git add -u` stages modifications, never additions, so these would not ship.\n  Stage them deliberately (git add <path>) and run the release again.",
		);
		process.exit(1);
	}

	const level = bumpLevelFrom(args);
	const current = JSON.parse(fs.readFileSync("package.json", "utf8")).version;
	const next = nextVersion(current, level);

	// The message must actually carry the placeholder. Without this, a
	// message written with a literal version silently disagrees with the
	// version that shipped -- which is exactly how SearchField ended up
	// released as 0.36.10 under a commit announcing v0.37.0.
	// The token, not the parenthetical. The original form required the exact
	// string "(vX.Y.Z)" with its own brackets, which disagreed with this
	// repo's actual commit convention -- the ActionDock release reads
	// "(v0.35.0, gap #66)" -- so a correctly-written message silently skipped
	// substitution and announced a version that was never released. Found by
	// this guard on its first real use, which is the outcome it was for.
	if (!msg.includes("vX.Y.Z")) {
		console.error(
			`release: the message must contain the literal "vX.Y.Z", which is replaced with the computed version. Refusing to publish ${next} under a message that names a different one.`,
		);
		process.exit(1);
	}

	for (const p of PKGS) {
		const s = fs.readFileSync(p, "utf8");
		const replaced = s.replace(`"version": "${current}"`, `"version": "${next}"`);
		if (replaced === s) {
			console.error(`release: ${p} does not carry version ${current}; refusing a partial bump.`);
			process.exit(1);
		}
		fs.writeFileSync(p, replaced);
	}
	console.log(`── release: ${current} -> ${next} (${level}) ──`);

	// Fast local tiers. The publish workflow runs the full matrix afterward.
	run("npx", ["vitest", "run"], { cwd: "packages/strand-ui" });
	run("pnpm", ["build:docs"]);
	run("pnpm", ["--filter", "./packages/strand-ui", "build"]);
	// MUST follow the build and precede the commit. `measure-bundle` lived only
	// in `pnpm build`, which a release does not run, so every published
	// `parity-manifest.json` described the PREVIOUS release's bundle -- the one
	// number in the manifest a consumer cannot check without rebuilding, stamped
	// from whatever the developer last happened to run locally. Two things then
	// read it as fact: this repo's own bundle-budget gate, and any consumer that
	// trusts the manifest. Found when a DS sync reported a size that no file in
	// the tree could produce.
	run("pnpm", ["measure-bundle"]);
	run("pnpm", ["test:layout"]);

	const finalMsg = msg.replaceAll("vX.Y.Z", `v${next}`);
	run("git", ["add", "-u"]);
	run("git", ["commit", "-m", finalMsg]);
	run("git", ["push", "origin", "main"]);
	console.log(`── released ${next}; publish workflow is CI's job, consumers may sync local-first now ──`);
}

if (isEntry) main();
