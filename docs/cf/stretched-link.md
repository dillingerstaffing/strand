# The stretched link grows a card's hit area without adding a control or a tab stop

`.strand-stretch-link-host` with `.strand-stretch-link` on the anchor makes a card's whole surface open one destination while the anchor stays the card's only named link and only tab stop: the anchor's `::after` overlays the host. The overlay covers everything in the host, so a card that also holds a button, a control or a player must not use it; that refusal is the consumer's, derived from whether such a child exists, because CSS cannot detect it. It is proven by a click at the card's far edge in a real browser, not by a box measurement: the anchor's own rect is the width of its text either way.

Where: `packages/strand-ui/src/utilities.css`
