# The search trigger is a button wearing the field's box, and its label is clipped, never removed

`.strand-search-trigger` composes `.strand-search-field`, which owns the shape, so the two cannot drift apart visually; it is a `<button aria-haspopup="dialog">` rather than an input because an input that opens an overlay on focus violates WCAG 3.2.1 (On Focus), gives one query two homes, and makes `role="search"` promise typing that does not happen. It resets the UA button appearance and padding-block so it matches the field's height. The `--icon` presentation is square at the touch target for the viewport band where a header has no room for a 300px field, and its label is clipped to a 1px box (position absolute, overflow hidden), never `display: none`, because the label is the control's accessible name (WCAG 2.5.3) and removing it leaves a button that announces nothing.

Where: `packages/strand-ui/src/components/SearchTrigger/SearchTrigger.css`
