<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Toggle switch for binary on/off settings with optional inline label.

  @example
  ```svelte
  <script>
    import { Switch } from '@dillingerstaffing/strand-svelte';
    let darkMode = false;
  </script>

  <Switch bind:checked={darkMode} label="Dark mode" />
  ```
-->
<script lang="ts">
  /** On state; bindable, so the switch owns it unless the consumer does. */
  export let checked: boolean = false
  export let disabled: boolean = false
  /** Inline label text */
  export let label: string | undefined = undefined
  /** Change handler */
  export let onchange: ((checked: boolean) => void) | undefined = undefined
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  export let density: 'comfortable' | 'compact' = 'comfortable'

  function toggle() {
    if (disabled) return
    checked = !checked
    onchange?.(checked)
  }
</script>

<label class={['strand-switch', density === 'compact' && 'strand-switch--compact'].filter(Boolean).join(' ')}>
  <button type="button" role="switch" class="strand-switch__track" aria-checked={checked ? 'true' : 'false'} {disabled} on:click={toggle} {...$$restProps}>
    <span class="strand-switch__thumb" aria-hidden="true"></span>
  </button>
  {#if label}
    <span class="strand-switch__label">{label}</span>
  {/if}
</label>
