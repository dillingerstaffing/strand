# A big mono time uses tabular figures, so a column of times never ripples

`.strand-big-mono-time` sets `font-variant-numeric: tabular-nums`; at display size proportional figures make 06:45 and 11:11 different widths and a column of times wobbles. The negative tracking closes mono's looseness at that scale without touching the figure advance. The range separator is quieter than the figures and `user-select: none`, so copying yields the times rather than the punctuation. It is a value alone at display scale, not a `DataReadout`, which pairs a label with a value.

Where: `packages/strand-ui/src/components/BigMonoTime/BigMonoTime.css`
