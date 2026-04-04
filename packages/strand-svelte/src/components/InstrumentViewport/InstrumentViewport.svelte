<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Show grid overlay lines */
  export let grid: boolean = false

  $: classes = [
    'strand-instrument-viewport',
    grid && 'strand-instrument-viewport--grid',
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>
