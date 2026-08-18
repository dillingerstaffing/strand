# A chip set wraps on a wide viewport and scrolls, never clips, on a narrow one

`.strand-chip-set` wraps in a desktop rail and, as `--scroll`, composes `strand-scroll-row` so a filter strip stays one line at 390px instead of wrapping to three and pushing the content it filters off screen; it scrolls rather than clipping because a filter the reader cannot reach is not a filter. Selection is styled from the ARIA state, `[aria-pressed="true"]` for multi-select and `[aria-checked="true"]` inside a radiogroup for single-select, so the painted state and the announced state cannot drift. The coarse-pointer floor is applied at `@media (pointer: coarse)`, not at a width breakpoint. The `--sm` density changes type and padding only and stays past SC 2.5.8's 24px.

Where: `packages/strand-ui/src/components/ChipSet/ChipSet.css`
