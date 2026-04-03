<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Visual style variant */
  export let variant: 'elevated' | 'outlined' | 'interactive' = 'elevated'
  /** Inner padding */
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md'

  $: classes = [
    'strand-card',
    `strand-card--${variant}`,
    `strand-card--pad-${padding}`,
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>
