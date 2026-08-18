# Sticky offsets are a token, and no library container may become a scrollport by accident

`.strand-sticky` holds at `--strand-sticky-top` (default space-6), a custom property because the value is whatever fixed chrome the consumer's page has. A sticky element sticks to its nearest scrollport, and any ancestor with `overflow: hidden` is one, so inside such an ancestor it sticks to a box that never scrolls and looks ignored; this is why the app shell clips with `overflow: clip` and the grid does not clip at all.

Where: `packages/strand-ui/src/utilities.css`; `docs/cf/app-shell.md`, `docs/cf/grid-tracks.md`
