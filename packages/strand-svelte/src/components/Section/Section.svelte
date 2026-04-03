<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Padding variant */
  export let variant: 'standard' | 'hero' = 'standard'
  /** Surface background */
  export let background: 'primary' | 'elevated' | 'recessed' = 'primary'

  $: classes = [
    'strand-section',
    `strand-section--${variant}`,
    `strand-section--bg-${background}`,
  ].filter(Boolean).join(' ')
</script>

<section class={classes} {...$$restProps}>
  <slot />
</section>
