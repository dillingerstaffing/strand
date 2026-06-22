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

  $: gridTemplateColumns =
    minColWidth != null
      ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`
      : `repeat(${columns}, 1fr)`
  $: inlineStyle = `grid-template-columns: ${gridTemplateColumns}; gap: var(--strand-space-${gap});`
</script>

<div class="strand-grid" style={inlineStyle} {...$$restProps}>
  <slot />
</div>
