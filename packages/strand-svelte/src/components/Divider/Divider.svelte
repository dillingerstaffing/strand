<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Visual separator line between content sections, horizontal or vertical.

  @example
  ```svelte
  <script>
    import { Divider } from '@dillingerstaffing/strand-svelte';
  </script>

  <Divider direction="horizontal" label="OR" />
  ```
-->
<script lang="ts">
  /** Separator direction */
  export let direction: 'horizontal' | 'vertical' = 'horizontal'
  /** Optional label text displayed in the middle of the line */
  export let label: string | undefined = undefined

  $: isVertical = direction === 'vertical'
</script>

{#if isVertical}
  <div
    role="separator"
    aria-orientation="vertical"
    class={['strand-divider', 'strand-divider--vertical'].join(' ')}
    {...$$restProps}
  ></div>
{:else if label}
  <div
    role="separator"
    aria-orientation="horizontal"
    class={['strand-divider', 'strand-divider--horizontal', 'strand-divider--labeled'].join(' ')}
    {...$$restProps}
  >
    <span class="strand-divider__line"></span>
    <span class="strand-divider__label">{label}</span>
    <span class="strand-divider__line"></span>
  </div>
{:else}
  <hr
    role="separator"
    aria-orientation="horizontal"
    class={['strand-divider', 'strand-divider--horizontal'].join(' ')}
    {...$$restProps}
  />
{/if}
