# The tooltip wrapper contains layout so a nowrap popup cannot bloat an ancestor's scroll width

`.strand-tooltip` carries `contain: layout`. The popup is absolutely positioned and `white-space: nowrap`, which stops it contributing to layout flow but not to scroll extent, so a long tooltip beside a viewport-edge trigger overflowed the containing card on narrow viewports and failed the overflow budget. Containment scopes that extent to the wrapper.

Where: `packages/strand-ui/src/components/Tooltip/Tooltip.css`
