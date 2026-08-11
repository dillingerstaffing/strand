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
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const args = process.argv.slice(2);
const msgIx = args.indexOf("--msg");
const msg = msgIx >= 0 ? args[msgIx + 1] : null;
if (!msg) {
	console.error('usage: pnpm release --msg "type(strand): subject (vX.Y.Z)"');
	process.exit(1);
}

const run = (cmd, cmdArgs, opts = {}) =>
	execFileSync(cmd, cmdArgs, { stdio: "inherit", ...opts });
const out = (cmd, cmdArgs) => execFileSync(cmd, cmdArgs, { encoding: "utf8" }).trim();

// Refuse a tree with nothing to release: an accidental double invocation
// would otherwise create an empty bump commit.
if (out("git", ["status", "--porcelain"]) === "") {
	console.error("release: working tree is clean; nothing to release.");
	process.exit(1);
}

const PKGS = [
	"package.json",
	"packages/strand-ui/package.json",
	"packages/strand-svelte/package.json",
	"packages/strand-vue/package.json",
	"packages/tokens/package.json",
];

const current = JSON.parse(fs.readFileSync("package.json", "utf8")).version;
const [maj, min, pat] = current.split(".").map(Number);
const next = `${maj}.${min}.${pat + 1}`;
for (const p of PKGS) {
	const s = fs.readFileSync(p, "utf8");
	const replaced = s.replace(`"version": "${current}"`, `"version": "${next}"`);
	if (replaced === s) {
		console.error(`release: ${p} does not carry version ${current}; refusing a partial bump.`);
		process.exit(1);
	}
	fs.writeFileSync(p, replaced);
}
console.log(`── release: ${current} -> ${next} ──`);

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
