# The skip link is fixed, hidden by transform, and revealed on focus

`.strand-skip-link` is the one bypass a sighted keyboard user has (WCAG 2.4.1): landmarks serve assistive tech only, and `.strand-sr-only` cannot build a skip link because it has no focus reveal. So the primitive is a pair: the base rule hides the link with a `translateY` off-screen and `position: fixed`, and `:focus-visible` brings it to `translateY(0)` with its own outline. It must stay `fixed` (absolute would scroll away with the page), sit above the banner and both nav layers (`z-index` over 101), and carry no transition, so it needs no reduced-motion counterpart. Measured need on a 250-event Weekly Ship list: 1,260 tab stops and 46 phone screens from the top of the page to the footer, collapsed to two by this link.

Where: `packages/strand-ui/src/components/SkipLink/SkipLink.css`
