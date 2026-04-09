<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Animated loading indicator with screen-reader-accessible status text.

  @example
  ```svelte
  <script>
    import { Spinner } from '@dillingerstaffing/strand-svelte';
  </script>

  <Spinner size="lg" />
  ```
-->
<script lang="ts">
  /** Size of the spinner */
  export let size: 'sm' | 'md' | 'lg' = 'md'

  $: classes = [
    'strand-spinner',
    `strand-spinner--${size}`,
  ].filter(Boolean).join(' ')
</script>

<span class={classes} role="status" {...$$restProps}>
  <span class="strand-spinner__ring" aria-hidden="true"></span>
  <span class="strand-spinner__sr-only">Loading</span>
</span>
