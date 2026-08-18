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
  export let size: 'sm' | 'md' | 'lg' = 'md'
  /** What is loading, read to assistive tech. */
  export let label: string = 'Loading'
</script>

<span class={`strand-spinner strand-spinner--${size}`} role="status" {...$$restProps}>
  <span class="strand-spinner__ring" aria-hidden="true"></span>
  <span class="strand-sr-only">{label}</span>
</span>
