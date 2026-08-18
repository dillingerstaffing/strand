# A count badge paints small text on its fill, so every fill takes the deep rung

`.strand-badge__indicator` paints white at `--strand-text-xs`, which is small text and owes 4.5:1, not the 3:1 the fill-tier accents are tuned for. Teal (2.49:1), blue (3.29:1) and red (3.76:1) at their base rungs put a count badge below AA, so each status variant uses the deep rung of its accent, the same move `.strand-btn--primary` makes with blue-deep. `Badge.test.tsx` computes the ratios from the token file. The live variant applies the pulse keyframe to the badge itself, because "is it live" and "what colour is it" are independent questions and the trailing-dot pulse pattern cannot lead a line of text.

Where: `packages/strand-ui/src/components/Badge/Badge.css`, `Badge.test.tsx`
