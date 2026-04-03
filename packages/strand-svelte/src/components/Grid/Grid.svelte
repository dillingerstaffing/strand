<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
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
