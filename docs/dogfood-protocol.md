# Strand Dogfood Protocol

Strand maintains its quality by running a continuous dogfood loop: an agent armed only with Strand's public artifacts builds showcases, humans review them against a high bar, and every gap feeds back into the design system at the correct layer. This document describes the protocol in consumer-facing terms so external contributors and users can understand how Strand evolves.

## Why dogfood

Design systems drift. Components accumulate edge cases that only the original team can compose correctly. Documentation falls behind implementation. Adopters end up writing workarounds that should have been primitives.

Strand resists this by forcing a recurring test: can an agent with only the public artifacts (npm packages, AGENTS.md, llms.txt, README, docs/design-language.md, generated/html-reference.md, migration guides, component source in the repo) build a world-class showcase? Every time the answer is "not quite", Strand learns something about itself and fixes it at the right layer.

## The gap hierarchy

When a dogfood iteration produces a result that does not meet the bar, the reviewer classifies the gap into one of three layers. Each layer has a different fix surface.

### L1: Usage gap

**The primitive exists. The agent used it wrong or composed it wrong.**

A world-class designer using the current Strand API could produce the desired result. The gap is that the agent did not know how or did not choose the right composition.

- Fix: improve Strand's public documentation. Add guidance to the component README, update generated/html-reference.md, add an example, clarify the "when to use" language.
- Scope: documentation only. No library code changes.
- Propagation: docs only. No version bump required.

### L2: Library gap

**The primitive does not exist, but it could be added without changing the design language specification.**

A world-class designer using the current Strand API would have to invent new CSS classes or new components to achieve the desired result. The gap is a missing primitive in the library.

- Fix: add the primitive to the Strand UI library. The addition must land in EVERY consumer type in the same release: strand-ui (Preact/React), strand-svelte, strand-vue, the standalone CSS bundle, the tokens package if new tokens are required, and the Bulma coexistence layer if its mappings are affected.
- Scope: code changes across every consumer type + tests + docs + migration guide updates.
- Propagation: version bump in lockstep. Published atomically by the release workflow.

### L3: Design language gap

**The design language specification itself is incomplete.**

The `docs/design-language.md` spec does not define a required token, principle, spacing rule, shape, or pattern. No library primitive can be correctly built without first updating the spec.

- Fix: update `docs/design-language.md` first. Then cascade to every consumer type's implementation. This is the most expensive class of gap.
- Scope: spec + every consumer type + every downstream consumer (including external projects that pin to Strand tokens).
- Propagation: major or minor version bump depending on backward compatibility.

### The decision tree

1. Could a world-class designer using ONLY the current public API build this correctly?
   - YES then **L1** (fix docs)
   - NO then go to 2
2. Can the required primitive be added without changing docs/design-language.md?
   - YES then **L2** (add primitive to every consumer type, atomic release)
   - NO then **L3** (update spec, then cascade)

## The iteration loop

1. Scaffold a showcase: `pnpm dogfood <name>` (e.g., `pnpm dogfood pricing-page`)
2. Launch a fresh Claude Code session in the Strand repo directory (isolation invariant)
3. Paste the generated `.dogfood-launch.md` prompt as the first message
4. The Consumer Agent reads only Strand's public files and builds the showcase
5. Audit for leaks: `pnpm audit-dogfood <name>` (must pass)
6. Human reviews the result in a browser
7. Binary verdict:
   - **Pass**: showcase graduates (see criteria below)
   - **Fail**: human names the flaws, classifies each as L1/L2/L3, logs to `docs/dogfood-gaps.md`, fixes flow to the correct layer, re-run from step 1

## Graduation criteria

A showcase earns a production mirror (and the gallery slot on the Strand docs site) only when it passes all five:

1. **Visual world-class**: binary human call. When compared against award-winning UI galleries, the showcase looks magnitudes better.
2. **Accessibility**: axe-core WCAG 2.2 AA pass, zero violations.
3. **Performance**: First Contentful Paint under 1.2 seconds on a 4G throttle, Cumulative Layout Shift under 0.05, Total Blocking Time under 150 ms.
4. **Purity**: `pnpm purity-scan packages/strand-examples/<name>/dist/assets/*.css` finds zero non-Strand classes and zero raw hex colors.
5. **Leak check**: `pnpm audit-dogfood <name>` finds zero references to forbidden terms.

Showcases that pass graduation join the Strand UI Showcases gallery. Showcases that fail stay in the repo until they are iterated to a passing state, or are archived with an explanation.

## What the dogfood proves

Every passing showcase is evidence that Strand's public API, as-is, can produce world-class UI. Every failing iteration is evidence that Strand has a specific gap at a specific layer, with a specific fix path. The `docs/dogfood-gaps.md` log is the living record of both, and it is public.

This is not a test that Strand eventually passes and then stops running. It is a continuous stress test that shapes the library's evolution. External contributors can read `docs/dogfood-gaps.md` to see what Strand is currently learning.

## Isolation invariant

The Consumer Agent must run in a fresh Claude Code session whose current working directory is the Strand repo. Any other launch method (subagent of a broader session, bash-spawned subprocess) inherits filesystem permissions and breaks the isolation. The audit script (`pnpm audit-dogfood`) is the post-hoc enforcement backstop; it fails the iteration if forbidden terms leak into the showcase source.

## Who this is for

- **External consumers**: you can read this document to understand how Strand maintains quality. The `docs/dogfood-gaps.md` log shows you what we have learned. The showcases in `packages/strand-examples/` show you what Strand can do.
- **Contributors**: when you find a rough edge in Strand, classify it into the gap hierarchy and open a PR that addresses the correct layer. A "fix" that lands at the wrong layer (e.g., patching a showcase to work around a missing primitive) is rejected because it does not improve Strand.
- **Strand maintainers**: this document is the protocol. Run it. Log every iteration.
