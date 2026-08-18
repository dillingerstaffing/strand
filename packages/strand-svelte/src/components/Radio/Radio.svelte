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
  /** Checked state; bindable, so the input owns it unless the consumer does. */
  export let checked: boolean = false
  export let disabled: boolean = false
  export let label: string | undefined = undefined
  /** Radio group name */
  export let name: string | undefined = undefined
  /** Radio value */
  export let value: string | undefined = undefined
  /** Change handler */
  export let onchange: ((e: Event) => void) | undefined = undefined
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  export let density: 'comfortable' | 'compact' = 'comfortable'

  function handleChange(e: Event) {
    if (!disabled) onchange?.(e)
  }
</script>

<label class={['strand-radio', density === 'compact' && 'strand-radio--compact'].filter(Boolean).join(' ')}>
  <input type="radio" class="strand-radio__native strand-sr-only" {checked} {disabled} {name} {value} on:change={handleChange} {...$$restProps} />
  <span class="strand-radio__control" aria-hidden="true">
    <span class="strand-radio__dot"></span>
  </span>
  {#if label}
    <span class="strand-radio__label">{label}</span>
  {/if}
</label>
