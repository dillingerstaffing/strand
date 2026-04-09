<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Single-selection control for use within a radio group.

  @example
  ```svelte
  <script>
    import { Radio } from '@dillingerstaffing/strand-svelte';
    let selected = 'pro';
  </script>

  <Radio name="plan" value="pro" label="Pro" checked={selected === 'pro'} />
  <Radio name="plan" value="free" label="Free" checked={selected === 'free'} />
  ```
-->
<script lang="ts">
  /** Controlled checked state */
  export let checked: boolean = false
  /** Disabled state */
  export let disabled: boolean = false
  /** Label text */
  export let label: string | undefined = undefined
  /** Radio group name */
  export let name: string | undefined = undefined
  /** Radio value */
  export let value: string | undefined = undefined
  /** Change handler */
  export let onchange: ((e: Event) => void) | undefined = undefined

  $: classes = [
    'strand-radio',
    checked && 'strand-radio--checked',
    disabled && 'strand-radio--disabled',
  ].filter(Boolean).join(' ')

  function handleChange(e: Event) {
    if (!disabled) {
      onchange?.(e)
    }
  }
</script>

<label class={classes}>
  <input
    type="radio"
    class="strand-radio__native"
    {checked}
    {disabled}
    {name}
    {value}
    on:change={handleChange}
    {...$$restProps}
  />
  <span class="strand-radio__control" aria-hidden="true">
    <span class="strand-radio__dot"></span>
  </span>
  {#if label}
    <span class="strand-radio__label">{label}</span>
  {/if}
</label>
