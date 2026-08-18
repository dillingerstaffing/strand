<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Primary action trigger with multiple visual variants and sizes.

  @example
  ```svelte
  <script>
    import { Button } from '@dillingerstaffing/strand-svelte';
  </script>

  <Button variant="primary" size="md" onclick={() => {}}>
    Submit
  </Button>
  ```
-->
<script lang="ts">
  /** Visual style variant */
  export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary'
  /** Button size */
  export let size: 'sm' | 'md' | 'lg' = 'md'
  /** Show loading spinner and disable interaction */
  export let loading: boolean = false
  /** Square button for icon-only use */
  export let iconOnly: boolean = false
  /** HTML button type */
  export let type: 'button' | 'submit' | 'reset' = 'button'
  /** Disabled state */
  export let disabled: boolean = false
  /** Stretch to full container width */
  export let fullWidth: boolean = false
  /** Click handler */
  export let onclick: ((event: MouseEvent) => void) | undefined = undefined
  /** Render an anchor with the button's classes; `href` implies it */
  export let as: 'button' | 'a' | undefined = undefined
  /** Destination when rendered as an anchor */
  export let href: string | undefined = undefined

  $: isDisabled = disabled || loading
  $: isAnchor = as === 'a' || href != null

  $: classes = [
    'strand-btn',
    `strand-btn--${variant}`,
    `strand-btn--${size}`,
    iconOnly && 'strand-btn--icon-only',
    fullWidth && 'strand-btn--full-width',
    loading && 'strand-btn--loading',
  ].filter(Boolean).join(' ')

  function handleClick(event: MouseEvent) {
    if (!isDisabled && onclick) {
      onclick(event)
    }
  }
</script>

{#if isAnchor}
  <a
    class={classes}
    href={isDisabled ? undefined : href}
    aria-disabled={isDisabled ? 'true' : undefined}
    aria-busy={loading ? 'true' : undefined}
    on:click={handleClick}
    {...$$restProps}
  >
    {#if loading}
      <span class="strand-btn__spinner" aria-hidden="true"></span>
    {/if}
    <span class="strand-btn__content" style={loading ? 'visibility: hidden' : undefined}>
      <slot />
    </span>
  </a>
{:else}
  <button
    {type}
    class={classes}
    disabled={isDisabled}
    aria-disabled={isDisabled ? 'true' : undefined}
    aria-busy={loading ? 'true' : undefined}
    on:click={handleClick}
    {...$$restProps}
  >
    {#if loading}
      <span class="strand-btn__spinner" aria-hidden="true"></span>
    {/if}
    <span class="strand-btn__content" style={loading ? 'visibility: hidden' : undefined}>
      <slot />
    </span>
  </button>
{/if}
