# The fallback faces are metric-matched to Inter and JetBrains Mono, and they swap

base.css declares `local()`-only `@font-face` fallbacks whose `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` are measured so the system fallback occupies the same advances and vertical metrics as the webfont: the swap changes glyph shapes without moving a line, which removes the largest layout shift on a text-heavy page. Nothing is downloaded; where the named system font is absent the face fails and the next family applies unadjusted. `font-display: swap` is load-bearing: the default (`auto`, block in Chrome) keeps text invisible for up to 3s when a local face is absent, measured as first contentful paint going from 0.4s to 2.9s.

Where: `packages/tokens/css/base.css`
