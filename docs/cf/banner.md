# The banner pushes the whole fixed stack down, and its text is capped at a measure

`.strand-banner` is fixed to the top of the viewport. It pushes a glass nav down with `top` (that nav is fixed, so margin has no effect on it) and an in-flow nav with `margin-top`, and `body:has(.strand-banner)` subtracts `--strand-banner-height` from the full-bleed instrument viewport, which is a descendant of body rather than a sibling of the banner. The Banner component sets `--strand-banner-height` on mount; the html `scroll-padding-top` and the glass-nav body offset both read it, defaulting to 0. `.strand-banner__text` is capped at 65ch and centred with auto margins: it is the only full-bleed text in the language, and uncapped it ran ~211 characters at 1440 against the design language's 60 to 75.

Where: `packages/strand-ui/src/components/Banner/Banner.css`, `packages/tokens/css/base.css`
