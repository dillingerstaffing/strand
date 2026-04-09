<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Native select dropdown with styled wrapper, error state, and placeholder support.

  @example
  ```svelte
  <script>
    import { Select } from '@dillingerstaffing/strand-svelte';
    let role = 'eng';
    const options = [
      { value: 'eng', label: 'Engineer' },
      { value: 'design', label: 'Designer' },
    ];
  </script>

  <Select placeholder="Choose a role" {options} bind:value={role} />
  ```
-->
<script lang="ts">
  export interface SelectOption {
    value: string
    label: string
  }

  /** Array of options to display */
  export let options: SelectOption[] = []
  /** Disabled state */
  export let disabled: boolean = false
  /** Currently selected value */
  export let value: string | undefined = undefined
  /** Show error styling */
  export let error: boolean = false
  /** Placeholder text shown as first disabled option */
  export let placeholder: string | undefined = undefined
  /** Change handler */
  export let onchange: ((e: Event) => void) | undefined = undefined

  $: wrapperClasses = [
    'strand-select',
    error && 'strand-select--error',
    disabled && 'strand-select--disabled',
  ].filter(Boolean).join(' ')
</script>

<div class={wrapperClasses}>
  <select
    class="strand-select__field"
    {value}
    {disabled}
    aria-invalid={error ? 'true' : undefined}
    on:change={onchange}
    {...$$restProps}
  >
    {#if placeholder}
      <option value="" disabled>{placeholder}</option>
    {/if}
    {#each options as opt (opt.value)}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
  <span class="strand-select__arrow" aria-hidden="true"></span>
</div>
