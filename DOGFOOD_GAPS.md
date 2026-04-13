# Strand Dogfood Gaps Log

Append-only log of gaps discovered through dogfooding and production consumer usage. Each entry records the gap, its L1/L2/L3 classification, and the fix.

---

## 2026-04-13: Cross-browser :has() and dvh gaps (6 L2 gaps)

**Discovery:** Production user on Firefox Android reported forms not loading on dillingerstaffing.com. Root cause: CSS `:has()` selector unsupported on Firefox <121. Affects all Strand consumers using glass nav or banners.

| # | Gap | Classification | Fix |
|---|---|---|---|
| A | `body:has(.strand-nav--glass)` body padding | L2 Library | Class-based fallback (`body.strand-glass-nav-active`) in base.css + Nav component useEffect + vanilla runtime |
| B | `body:has(.strand-banner)` viewport offset | L2 Library | Class-based fallback (`body.strand-banner-active`) in Banner.css + vanilla runtime |
| C | `.strand-search-bar__inner:has(input:focus)` focus ring | L2 Library | Replaced with `:focus-within` (universally supported) |
| D | Vanilla-html consumer has no JS behavior | L2 Library | Created vanilla runtime (`dist/vanilla/strand-ui.js`) with CodeBlock copy, Nav hamburger, :has() fallbacks, Tabs enhancement |
| E | Tabs have no vanilla-html switching | L2 Library | Vanilla runtime wires `[role="tablist"]` with click + keyboard nav |
| F | `min-height: 100dvh` without `100vh` fallback in reset.css | L2 Library | Added `min-height: 100vh` before `dvh` line |
