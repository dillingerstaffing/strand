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
  export let variant: 'elevated' | 'outlined' | 'flat' | 'warm' | 'interactive' = 'elevated'
  /** Inner padding */
  export let padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
  /** Hover lift and pointer, without changing the variant */
  export let interactive: boolean = false
  /** Marks the card as the active item; paints no chrome of its own */
  export let active: boolean = false
  /** Root element */
  export let as: string = 'div'

  $: classes = [
    'strand-card',
    variant !== 'elevated' && `strand-card--${variant}`,
    `strand-card--pad-${padding}`,
    interactive && variant !== 'interactive' && 'strand-card--interactive',
    active && 'strand-card--active',
  ].filter(Boolean).join(' ')
</script>

<svelte:element this={as} class={classes} {...$$restProps}>
  <slot />
</svelte:element>
