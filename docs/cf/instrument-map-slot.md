# The map slot is sized by the viewport, sets no z-index, and outranks maplibre by selector

`.strand-instrument-viewport .strand-instrument-viewport__map` is `position: absolute; inset: 0; width: 100%; height: 100%`, so a map library's container has a non-zero box to paint into (a raw div collapses to height 0 and maplibre initialises a zero-size canvas and renders nothing). It sets no z-index: one would create a stacking context that traps the library's markers below the viewport's scanline and vignette. The descendant selector is deliberate: maplibre-gl.css is appended at runtime after strand-ui.css and sets `.maplibregl-map { position: relative }`, so a single-class rule would tie on specificity and lose on order. The maplibre chrome overrides that follow are scoped inside the viewport so they never reach a light map elsewhere.

Where: `packages/strand-ui/src/components/InstrumentViewport/InstrumentViewport.css`
