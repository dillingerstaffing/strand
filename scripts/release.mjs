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

	const level = bumpLevelFrom(args);
	const current = JSON.parse(fs.readFileSync("package.json", "utf8")).version;
	const next = nextVersion(current, level);

	// The message must actually carry the placeholder. Without this, a
	// message written with a literal version silently disagrees with the
	// version that shipped -- which is exactly how SearchField ended up
	// released as 0.36.10 under a commit announcing v0.37.0.
	if (!msg.includes("(vX.Y.Z)")) {
		console.error(
			`release: the message must contain the literal "(vX.Y.Z)", which is replaced with the computed version. Refusing to publish ${next} under a message that names a different one.`,
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
	run("pnpm", ["test:layout"]);

	const finalMsg = msg.replace("(vX.Y.Z)", `(v${next})`);
	run("git", ["add", "-u"]);
	run("git", ["commit", "-m", finalMsg]);
	run("git", ["push", "origin", "main"]);
	console.log(`── released ${next}; publish workflow is CI's job, consumers may sync local-first now ──`);
}

if (isEntry) main();
