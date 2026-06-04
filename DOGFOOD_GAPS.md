# Strand Dogfood Gaps Log

This file is an append-only record of every dogfood iteration and every gap discovered. Each gap is classified L1 (usage), L2 (library), or L3 (design language) per `DOGFOOD_PROTOCOL.md`. The record is public because it is evidence of Strand's quality discipline and a learning resource for external consumers.

## Entry format

```
## Showcase: <name> - iteration <N>
Date: YYYY-MM-DD
Verdict: PASS | FAIL

### Gap #<n>
- Type: L1 | L2 | L3
- Symptom: what the reviewer saw
- Root cause: why it happened
- Fix: what was done
- Commit: <sha or PR link>
```

## Log

## Production consumer: dillingerstaffing.com - Firefox Android breakage
Date: 2026-04-13
Verdict: FAIL (6 L2 gaps discovered)

### Gap #1
- Type: L2
- Symptom: Nav overlays all page content on Firefox <121 (all 5 pages with glass nav)
- Root cause: `body:has(.strand-nav--glass)` in base.css uses `:has()` which Firefox <121 does not support. No class-based fallback existed.
- Fix: Added `body.strand-glass-nav-active` CSS rules in base.css. Nav component (Preact/Vue/Svelte) adds class on mount. Vanilla runtime adds class when `:has()` not supported.
- Commit: 18eb4fa

### Gap #2
- Type: L2
- Symptom: Full-bleed instrument viewport height miscalculated when banner present on Firefox <121
- Root cause: `body:has(.strand-banner)` in Banner.css uses `:has()`. No class-based fallback.
- Fix: Added `body.strand-banner-active` CSS rule in Banner.css. Vanilla runtime adds class when `:has()` not supported.
- Commit: 18eb4fa

### Gap #3
- Type: L2
- Symptom: Search bar focus ring missing on Firefox <121
- Root cause: `.strand-search-bar__inner:has(.strand-search-bar__input:focus)` uses `:has()`. `:focus-within` is universally supported and semantically equivalent.
- Fix: Replaced `:has()` with `:focus-within` in InstrumentViewport.css.
- Commit: 18eb4fa

### Gap #4
- Type: L2
- Symptom: Vanilla HTML consumer type has zero JS behavior (no copy buttons, no mobile nav, no :has() fallback)
- Root cause: No vanilla JS runtime existed in Strand. DS maintained behavior in a DS-authored file outside Strand.
- Fix: Created vanilla runtime at `dist/vanilla/strand-ui.js` with CodeBlock copy, Nav hamburger, :has() fallbacks, Tabs enhancement.
- Commit: 18eb4fa

### Gap #5
- Type: L2
- Symptom: Tabs have no vanilla HTML switching (CSS-only consumer using :has() radio pattern breaks on Firefox <121)
- Root cause: No JS tab enhancement for vanilla consumers.
- Fix: Vanilla runtime wires `[role="tablist"]` with click-to-switch, hidden toggle, active class, arrow/Home/End keyboard nav.
- Commit: 18eb4fa

### Gap #6
- Type: L2
- Symptom: `min-height: 100dvh` in reset.css has no `100vh` fallback
- Root cause: Inconsistency with strand-ui.css which correctly provides vh before dvh.
- Fix: Added `min-height: 100vh` before the `dvh` line in reset.css.
- Commit: 18eb4fa

## Production consumer: dillingerstaffing.com - Weekly Ship email lifecycle
Date: 2026-04-19
Verdict: PASS (after L2 primitive addition)

### Gap #7
- Type: L2
- Symptom: Weekly Ship page-local custom StarRating in ShipInteractive.js and a new server-rendered rate-via-token page both needed a star rating control. No Strand primitive existed, so consumers were rolling their own markup + CSS.
- Root cause: Library gap. StarRating is a common form pattern; absence of a primitive forced each consumer to re-implement the interaction, accessibility, and size tokens.
- Fix: Added L2 StarRating primitive across every framework (Preact/React, Svelte, Vue) + vanilla runtime hydration for `[data-strand-component="star-rating"]`. Added to parity-manifest.json so every consumer type must ship it in lockstep. Three sizes (sm/md/lg), readOnly prop, aria-label required, keyboard + click + hover parity with the old JSX version. Version bumped 0.15.2 to 0.16.0.
- Commit: feat/strand-star-rating

## Production consumer: dillingerstaffing.com - Weekly Ship post-RSVP commitment chip
Date: 2026-04-19
Verdict: PASS (after L2 variant addition)

### Gap #8
- Type: L2
- Symptom: Weekly Ship's featured event card has no visual confirmation that a signed-in user has already RSVP'd. The card always shows the "Next Ship" overline whether the user is committed or not. A post-RSVP affirmation block renders elsewhere on the page, but the focal card itself never reflects the commitment. Reason: Weekly Ship post-RSVP commitment chip. The existing `strand-status-chip` variants (`--live`, `--neutral`, `--accent`, `--caution`) do not express an earned-state commitment inside a dark instrument viewport.
- Root cause: StatusChip lacked a "committed" variant tuned for the dark instrument viewport. Teal-tint (the existing `--live` fill) is designed for light surfaces: on a near-black background it loses contrast ratio because both fill and text tokens assume a light card. A post-RSVP chip needs saturated teal text on a translucent teal fill so it reads clearly on dark without overpowering the event title (Principle 2, Biosynthetic Restraint). No primitive existed for this role.
- Fix: Added `.strand-status-chip--committed` variant to `static.css`. Uses `--strand-teal-vital` for text, `color-mix(in srgb, var(--strand-teal-vital) 16%, transparent)` for fill, and `color-mix(in srgb, var(--strand-teal-vital) 30%, transparent)` for border. Translucent composition keeps the chip readable on both dark instrument viewports and light surfaces. Documented in `generated/html-reference.md` and `scripts/data/class-docs.json`. All 8 consumer types inherit via the existing utility-class pipeline (same static.css bundle, same tokens package).
- Commit: feat/strand-status-chip-committed

## Production consumer: dillingerstaffing.com - Strand lab reference shell (mobile)
Date: 2026-06-03
Verdict: PASS (after L2 grid-track fix)

### Gap #9
- Type: L2
- Symptom: On narrow viewports the LabShell (`.strand-ref-shell`) reference/docs layout clipped its main content on the right. The left gutter rendered correctly while the heading, lead, and metrics row were cut off past the right edge, asymmetric. Reproduced at 320 / 360 / 375 / 390 / 414px.
- Root cause: `.strand-ref-shell` is a CSS grid (`256px 1fr`; a single column on mobile) with `overflow-x: clip`. A bare `1fr` track keeps an implicit min-content floor, so the main column refused to shrink below its widest child (a roughly 471px min-content) even at a 320px viewport. The shell's `overflow-x: clip` then hid the surplus as a hard right-edge cut instead of letting it scroll. This violated Strand's own Boundary Integrity principle, which the rev-14 grid track never applied to itself.
- Fix: The track is now `256px minmax(0, 1fr)` (and `minmax(0, 1fr)` on the mobile single column) plus `min-width: 0` on `.strand-ref-shell__main`, so the column shrinks to the viewport and content reflows within symmetric left/right gutters. Pure CSS in `packages/strand-ui/src/components/LabShell/LabShell.css`; all 8 consumer types inherit it through the shared CSS bundle (parity check green at 156 assertions). A CSS source guard was added to `LabShell.test.tsx`. Version bumped 0.17.4 to 0.17.5.
- Commit: fix/strand-lab-shell-mobile-gutters

## Production consumer: dillingerstaffing.com - Strand lab reveal specimen (manual replay)
Date: 2026-06-03
Verdict: PASS (after L2 cascade fix)

### Gap #10
- Type: L2
- Symptom: The `.strand-reveal-group--manual` staggered-entry specimen never appeared (lines stuck invisible) and the "Replay reveal" button did nothing. Confirmed in any browser supporting `animation-timeline: view()`: a manual reveal element carrying `.strand-reveal--visible` still computed `opacity: 0`.
- Root cause: In `ScrollReveal.css` the `@supports (animation-timeline: view())` block re-declares `.strand-reveal { opacity: 0 }` after `.strand-reveal--visible { opacity: 1 }`, at equal specificity (0,1,0). For the default scroll reveal that is harmless because `animation: strand-reveal-up both` drives opacity. But `--manual` sets `animation: none` to opt out of the view-timeline and never restored opacity control to `--visible`, so the later-source-order base rule pinned the element at opacity 0. Toggling `--visible` (what Replay does) had no visual effect.
- Fix: Added a compound, higher-specificity (0,2,0) rule so a manual reveal toggled visible wins: `.strand-reveal--manual.strand-reveal--visible, .strand-reveal-group--manual > .strand-reveal--visible { opacity: 1; transform: translateY(0); }`. Pure CSS in `packages/strand-ui/src/components/ScrollReveal/ScrollReveal.css`; all 8 consumer types inherit it. CSS source guard added to `ScrollReveal.test.tsx`. Version bumped 0.17.5 to 0.17.6.
- Commit: fix/strand-reveal-manual-visible
