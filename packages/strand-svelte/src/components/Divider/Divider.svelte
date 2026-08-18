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
  /** Separator direction. */
  export let direction: 'horizontal' | 'vertical' = 'horizontal'
  /** `gradient` fades the line out at both ends. */
  export let variant: 'line' | 'gradient' = 'line'
  /** Text set into the middle of a horizontal line; the default slot takes markup. */
  export let label: string | undefined = undefined

  $: isVertical = direction === 'vertical'
  $: isLabeled = !isVertical && (!!label || !!$$slots.default)
  $: classes = [
    'strand-divider',
    `strand-divider--${direction}`,
    variant === 'gradient' && 'strand-divider--gradient',
    isLabeled && 'strand-divider--labeled',
  ].filter(Boolean).join(' ')
</script>

{#if isVertical}
  <div role="separator" aria-orientation="vertical" class={classes} {...$$restProps}></div>
{:else if isLabeled}
  <div role="separator" aria-orientation="horizontal" class={classes} {...$$restProps}>
    <span class="strand-divider__line"></span>
    <span class="strand-divider__label"><slot>{label}</slot></span>
    <span class="strand-divider__line"></span>
  </div>
{:else}
  <hr class={classes} {...$$restProps} />
{/if}
