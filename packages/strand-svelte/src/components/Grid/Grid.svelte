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
  /** Number of equal-width columns */
  export let columns: number = 1
  /** Gap between items, maps to --strand-space-{n} */
  export let gap: number = 4

  $: inlineStyle = `grid-template-columns: repeat(${columns}, 1fr); gap: var(--strand-space-${gap});`
</script>

<div class="strand-grid" style={inlineStyle} {...$$restProps}>
  <slot />
</div>
