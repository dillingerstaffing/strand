<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Padding variant */
  export let variant: 'standard' | 'hero' | 'compact' = 'standard'
  /** Surface background */
  export let background: 'primary' | 'elevated' | 'recessed' = 'primary'
  /** Top border separator */
  export let borderTop: boolean = false

  $: classes = [
    'strand-section',
    `strand-section--${variant}`,
    `strand-section--bg-${background}`,
    borderTop && 'strand-section--border-top',
  ].filter(Boolean).join(' ')
</script>

<section class={classes} {...$$restProps}>
  <slot />
</section>
