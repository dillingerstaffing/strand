# The code block's copy control fits a one-line snippet and still offers a 44px target

`.strand-code-block__pre` and its `code` both declare explicit `color` and `background`, so axe never composites the inset shadow against the surface and reports a false contrast failure. A wrapper carrying `[data-strand-copy]` reserves right padding on the pre and floors it at the touch target, so even an empty block leaves room for the copy control. The visible control is 32px so it fits inside a one-line pre (about 47.66px tall) without bleeding out; a `::before` pseudo-element expands the hit area to 44px inside the reserved padding without moving a pixel. The icon swap is `display`, not opacity or transform, so reduced-motion users get the same instant feedback. The copied label uses the text tier of green; the border keeps the fill tier.

Where: `packages/strand-ui/src/components/CodeBlock/CodeBlock.css`
