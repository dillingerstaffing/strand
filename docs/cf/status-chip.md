# A status chip is one token whose glyph and label never separate

`.strand-status-chip` is `inline-flex`, not `inline-block`: as inline children the glyph and label had one line-break opportunity between them, so under squeeze the glyph orphaned onto its own line and the chip's height jumped from 25px to 41px, taking every sibling's baseline with it. `white-space: nowrap` is deliberately not set, so a long text-only chip wraps internally instead of overflowing its container. `> svg` is `flex: none`, because a shrinking glyph distorts before the text does. `--committed` takes the text tier of teal on a light surface (teal-vital over its own 16% fill composites to 2.15:1, the worst pairing in the library) and teal-vital only inside the dark cabinet, through its token.

Where: `packages/strand-ui/src/components/StatusChip/StatusChip.css`
