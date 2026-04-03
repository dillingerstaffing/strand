<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Max-width constraint */
  export let size: 'narrow' | 'default' | 'wide' | 'full' = 'default'

  $: classes = [
    'strand-container',
    `strand-container--${size}`,
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>
