<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Centered max-width wrapper for constraining page content.

  @example
  ```svelte
  <script>
    import { Container } from '@dillingerstaffing/strand-svelte';
  </script>

  <Container size="default">
    <p>Content constrained to default max width.</p>
  </Container>
  ```
-->
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
