<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  type Placement = 'top' | 'bottom' | 'left' | 'right'
  export let placement: Placement = 'top'
  $: classes = ['strand-ref-tip__bubble', `strand-ref-tip__bubble--${placement}`]
    .filter(Boolean)
    .join(' ')
</script>

<span class={classes} role="tooltip" {...$$restProps}>
  <slot />
</span>
