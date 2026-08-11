#!/usr/bin/env node
// Browser preflight: fail FIRST and loudly when `test:all` cannot run its
// browser tiers.
//
// `pnpm test:all` has an ENVIRONMENT PRECONDITION, not just a dependency list.
// Two of its tiers, layout and motion, drive real Chromium. Every other tier
// runs in Node or jsdom and needs nothing.
//
// That precondition used to be tribal knowledge living in a comment inside
// .github/workflows/ci.yml, and the cost of that is on the record. When the
// layout tier joined `test:all`, ci.yml gained an install step and
// publish.yml did not, because a comment in one workflow cannot protect
// another. Every Publish run failed from that moment. npm sat at 0.33.0 while
// main sat at 0.34.0 with a green CI run beside a red Publish run on the same
// commit, and a downstream consumer pulls from npm, so a primitive that was
// built, tested, documented and pushed could not be consumed by anybody.
//
// The tiers themselves already fail rather than skip when the browser is
// absent, which is the rule every tier here obeys and it is what surfaced the
// problem. But they fail LATE: `test:all` runs four cheap tiers first, so the
// cause landed at the bottom of a log under four green sections, framed as a
// layout failure rather than as a missing browser.
//
// Running this first turns the precondition into something the tooling states
// rather than something an author has to know. It also protects a local run,
// which is where the next person will hit it.
//
// Usage: pnpm test:browser-preflight  (runs automatically as part of test:all)

const INSTALL = "pnpm exec playwright install --with-deps chromium";

async function main() {
	let chromium;
	try {
		({ chromium } = await import("playwright"));
	} catch {
		console.error("\n  BROWSER PREFLIGHT FAILED: playwright is not installed.\n");
		console.error("  `pnpm test:all` runs two tiers in real Chromium (layout, motion).");
		console.error("  Install dependencies first:\n");
		console.error("    pnpm install\n");
		return 1;
	}

	// Actually launch it. Checking that the package resolves is not the same
	// claim: the failure this exists to catch is a MISSING BROWSER BINARY with
	// the playwright package present and importable, which is exactly the state
	// a CI runner is in after `pnpm install` and before `playwright install`.
	let browser;
	try {
		browser = await chromium.launch();
	} catch (err) {
		console.error("\n  BROWSER PREFLIGHT FAILED: could not launch Chromium.\n");
		console.error(`  ${String(err.message).split("\n")[0]}\n`);
		console.error("  `pnpm test:all` runs two tiers in real Chromium:");
		console.error("    test:layout   does the rendered box have the right geometry?");
		console.error("    test:motion   did anything actually animate, and within the rules?");
		console.error("\n  Neither can skip. A tier that skips reports the same green as a");
		console.error("  tier that passed, which is worse than having no tier.\n");
		console.error("  Fix:\n");
		console.error(`    ${INSTALL}\n`);
		console.error("  If you are adding a WORKFLOW that calls test:all, it needs that");
		console.error("  step too. See .github/workflows/ci.yml and publish.yml, which must");
		console.error("  stay in sync.\n");
		return 1;
	}
	await browser.close();

	console.log("  Browser preflight OK: Chromium launches, the browser tiers can run.");
	return 0;
}

process.exit(await main());
