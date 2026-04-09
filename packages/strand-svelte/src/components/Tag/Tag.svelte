<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Compact label for categorization, filtering, or status display.

  @example
  ```svelte
  <script>
    import { Tag } from '@dillingerstaffing/strand-svelte';
  </script>

  <Tag variant="solid" status="teal" removable onremove={() => {}}>
    Active
  </Tag>
  ```
-->
<script lang="ts">
  /** Visual style variant */
  export let variant: 'solid' | 'outlined' = 'solid'
  /** Color status */
  export let status: 'default' | 'teal' | 'blue' | 'amber' | 'red' = 'default'
  /** Show remove button */
  export let removable: boolean = false
  /** Called when remove button is clicked */
  export let onremove: (() => void) | undefined = undefined

  $: classes = [
    'strand-tag',
    `strand-tag--${variant}`,
    `strand-tag--${status}`,
  ].filter(Boolean).join(' ')
</script>

<span class={classes} {...$$restProps}>
  <span class="strand-tag__text"><slot /></span>
  {#if removable}
    <button
      type="button"
      class="strand-tag__remove"
      aria-label="Remove"
      on:click={() => onremove?.()}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  {/if}
</span>
