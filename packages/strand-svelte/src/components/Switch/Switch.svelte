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
  /** Controlled checked state */
  export let checked: boolean = false
  /** Disabled state */
  export let disabled: boolean = false
  /** Inline label text */
  export let label: string | undefined = undefined
  /** Change handler */
  export let onchange: ((checked: boolean) => void) | undefined = undefined

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
    'strand-switch',
    density === 'compact' && 'strand-switch--compact',
    checked && 'strand-switch--checked',
    disabled && 'strand-switch--disabled',
  ].filter(Boolean).join(' ')

  function handleClick() {
    if (!disabled) {
      onchange?.(!checked)
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
      e.preventDefault()
      onchange?.(!checked)
    }
  }
</script>

<label class={classes}>
  <button
    type="button"
    role="switch"
    class="strand-switch__track"
    aria-checked={checked ? 'true' : 'false'}
    {disabled}
    on:click={handleClick}
    on:keydown={handleKeyDown}
    {...$$restProps}
  >
    <span class="strand-switch__thumb" aria-hidden="true"></span>
  </button>
  {#if label}
    <span class="strand-switch__label">{label}</span>
  {/if}
</label>
