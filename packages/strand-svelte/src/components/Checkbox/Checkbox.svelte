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
  /** Controlled checked state */
  export let checked: boolean = false
  /** Indeterminate visual state */
  export let indeterminate: boolean = false
  /** Disabled state */
  export let disabled: boolean = false
  /** Label text */
  export let label: string | undefined = undefined
  /** Change handler */
  export let onchange: ((e: Event) => void) | undefined = undefined

  let inputEl: HTMLInputElement

  /**
   * Row density. `comfortable` is the default and is unchanged.
   *
   * `compact` drops the row's floor to 30px ON A FINE POINTER ONLY. DL 14.7
   * makes the floor a property of the input modality (coarse 44, fine 24),
   * and requires a shrink rule to be written inside `@media (pointer: fine)`
   * so touch is untouched by construction rather than by care.
   *
   * OPT-IN, which is 14.7 too: 44px remains the default everywhere. Reach for
   * it where density is the point and the region is pointer-driven.
   */
  export let density: 'comfortable' | 'compact' = 'comfortable'

  $: classes = [
    'strand-checkbox',
    density === 'compact' && 'strand-checkbox--compact',
    checked && 'strand-checkbox--checked',
    indeterminate && 'strand-checkbox--indeterminate',
    disabled && 'strand-checkbox--disabled',
  ].filter(Boolean).join(' ')

  $: ariaChecked = indeterminate ? 'mixed' : checked ? 'true' : 'false'

  $: if (inputEl) {
    inputEl.indeterminate = indeterminate
  }

  function handleChange(e: Event) {
    if (!disabled) {
      onchange?.(e)
    }
  }
</script>

<label class={classes}>
  <input
    bind:this={inputEl}
    type="checkbox"
    class="strand-checkbox__native"
    {checked}
    {disabled}
    aria-checked={ariaChecked}
    role="checkbox"
    on:change={handleChange}
    {...$$restProps}
  />
  <span class="strand-checkbox__control" aria-hidden="true">
    {#if indeterminate}
      <svg class="strand-checkbox__icon" viewBox="0 0 16 16" fill="none">
        <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    {:else if checked}
      <svg class="strand-checkbox__icon" viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    {/if}
  </span>
  {#if label}
    <span class="strand-checkbox__label">{label}</span>
  {/if}
</label>
