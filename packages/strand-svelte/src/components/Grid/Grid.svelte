<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  CSS Grid layout with configurable column count and gap spacing.

  @example
  ```svelte
  <script>
    import { Grid, Card } from '@dillingerstaffing/strand-svelte';
  </script>

  <Grid columns={3} gap={6}>
    <Card>Item 1</Card>
    <Card>Item 2</Card>
    <Card>Item 3</Card>
  </Grid>
  ```
-->
<script lang="ts">
  /** Number of equal-width columns. Ignored when minColWidth is set. */
  export let columns: number = 1
  /** Gap between items, maps to --strand-space-{n} */
  export let gap: number = 4
  /** Minimum column width (px) for a responsive auto-fit track. When set, columns is ignored. */
  export let minColWidth: number | undefined = undefined

  /**
   * A fixed 264px rail beside a flexible main track, collapsing to one
   * column below the md breakpoint. Takes precedence over columns and
   * minColWidth. Put the rail FIRST in the markup: below the breakpoint
   * the regions stack in source order, and a filter met after the results
   * it filters is one the reader has already scrolled past.
   */
  export let sidebar: boolean = false

  /** A flexible main track beside a fixed-width panel, collapsing to one
      column below md. `sidebar` mirrored. Set the width with
      --strand-split-panel (default 600px). Put the MAIN track first: the
      regions stack in source order below the breakpoint. */
  export let split: boolean = false

  /** Additional CSS class, MERGED with the component's own. Explicit prop
      rather than $$restProps, which spreads AFTER the class attribute and
      would REPLACE `strand-grid` outright. */
  let className: string = ''
  export { className as class }

  $: classes = ['strand-grid', sidebar ? 'strand-grid--sidebar' : '', split ? 'strand-grid--split' : '', className]
    .filter(Boolean)
    .join(' ')

  // The sidebar preset lives in the stylesheet because its column
  // definition changes at a breakpoint, and an inline style cannot carry a
  // media query. This emits no grid-template-columns at all in that case
  // rather than one the class would then have to fight.
  // `minmax(0, 1fr)`, never a bare `1fr`: a bare one floors at the track's
  // min-content width, so a single long unbroken string widens the grid past
  // its container. The base rule's `min-width: 0` on children handles the
  // ITEM; this handles the TRACK.
  $: gridTemplateColumns =
    minColWidth != null
      ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`
      : `repeat(${columns}, minmax(0, 1fr))`
  $: inlineStyle = sidebar || split
    ? `gap: var(--strand-space-${gap});`
    : `grid-template-columns: ${gridTemplateColumns}; gap: var(--strand-space-${gap});`
</script>

<div class={classes} style={inlineStyle} {...$$restProps}>
  <slot />
</div>
