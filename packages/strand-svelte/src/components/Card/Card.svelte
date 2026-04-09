<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Contained surface for grouping related content with elevation and padding options.

  @example
  ```svelte
  <script>
    import { Card } from '@dillingerstaffing/strand-svelte';
  </script>

  <Card variant="elevated" padding="lg">
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
  </Card>
  ```
-->
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
