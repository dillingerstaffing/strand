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
  import { resolveGapStep } from '../../spacing.js'
  /** Number of equal-width columns. Ignored when minColWidth is set. */
  export let columns: number = 1
  /** Gap between items, maps to --strand-space-{n} */
  export let gap: number = 4
  /** Minimum column width (px) for a responsive auto-fit track. When set, columns is ignored. */
  export let minColWidth: number | undefined = undefined

  /** A fixed 264px rail beside a flexible main track, collapsing to one column below the md breakpoint. */
  export let sidebar: boolean = false

  /** A flexible main track beside a fixed-width panel, collapsing to one column below md. */
  export let split: boolean = false

  /** Additional CSS class, MERGED with the component's own. */
  let className: string = ''
  export { className as class }

  $: classes = ['strand-grid', sidebar ? 'strand-grid--sidebar' : '', split ? 'strand-grid--split' : '', className]
    .filter(Boolean)
    .join(' ')

  // The sidebar preset lives in the stylesheet: its columns change at a breakpoint (cf: grid-tracks).
  $: gridTemplateColumns =
    minColWidth != null
      ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`
      : `repeat(${columns}, minmax(0, 1fr))`
  $: inlineStyle = sidebar || split
    ? `gap: var(--strand-space-${resolveGapStep(gap)});`
    : `grid-template-columns: ${gridTemplateColumns}; gap: var(--strand-space-${resolveGapStep(gap)});`
</script>

<div class={classes} style={inlineStyle} {...$$restProps}>
  <slot />
</div>
