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
  export let variant: 'solid' | 'outlined' = 'solid'
  export let status: 'default' | 'teal' | 'blue' | 'amber' | 'red' = 'default'
  /** Show the remove control. */
  export let removable: boolean = false
  /** Called when the remove control is pressed. */
  export let onremove: (() => void) | undefined = undefined
  /** Accessible name of the remove control. */
  export let removeLabel: string = 'Remove'
</script>

<span class={`strand-tag strand-tag--${variant} strand-tag--${status}`} {...$$restProps}>
  <span class="strand-tag__text"><slot /></span>
  {#if removable}
    <button type="button" class="strand-tag__remove" aria-label={removeLabel} on:click={() => onremove?.()}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  {/if}
</span>
