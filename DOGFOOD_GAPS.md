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
