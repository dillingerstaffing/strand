<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Toggle control for boolean or indeterminate selections with optional label.

  @example
  ```svelte
  <script>
    import { Checkbox } from '@dillingerstaffing/strand-svelte';
    let accepted = false;
  </script>

  <Checkbox bind:checked={accepted} label="Accept terms" />
  ```
-->
<script lang="ts">
  /** Checked state; bindable, so the input owns it unless the consumer does. */
  export let checked: boolean = false
  /** Mixed state; the DOM property, so :indeterminate paints and announces it. */
  export let indeterminate: boolean = false
  export let disabled: boolean = false
  export let label: string | undefined = undefined
  /** Change handler */
  export let onchange: ((e: Event) => void) | undefined = undefined
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  export let density: 'comfortable' | 'compact' = 'comfortable'

  function handleChange(e: Event) {
    if (!disabled) onchange?.(e)
  }
</script>

<label class={['strand-checkbox', density === 'compact' && 'strand-checkbox--compact'].filter(Boolean).join(' ')}>
  <input type="checkbox" class="strand-checkbox__native strand-sr-only" bind:checked bind:indeterminate {disabled} on:change={handleChange} {...$$restProps} />
  <span class="strand-checkbox__control" aria-hidden="true">
    <svg class="strand-checkbox__icon strand-checkbox__icon--check" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <svg class="strand-checkbox__icon strand-checkbox__icon--mixed" viewBox="0 0 16 16" fill="none">
      <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </span>
  {#if label}
    <span class="strand-checkbox__label">{label}</span>
  {/if}
</label>
