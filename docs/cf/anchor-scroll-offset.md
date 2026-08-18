# Anchor scrolls stop below the fixed stack, tracked by tokens

`html { scroll-padding-top: calc(var(--strand-nav-height) + var(--strand-banner-height, 0px)) }` offsets every anchor scroll (nav click, URL fragment, focus scroll) by the fixed nav plus an optional banner, so a target's top lands below the stack; the Banner component sets `--strand-banner-height` on mount. `scroll-behavior: smooth` is reset to `auto` under reduced motion. `.strand-section--scroll-target` restates the same tokens as `scroll-margin-top` for a per-section opt-in.

Where: `packages/tokens/css/base.css`, `packages/strand-ui/src/components/Section/Section.css`
