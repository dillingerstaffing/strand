<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Input type */
  export let type: 'text' | 'email' | 'password' | 'search' | 'number' = 'text'
  /** Show error styling */
  export let error: boolean = false
  /** Disabled state */
  export let disabled: boolean = false
  /** Whether there is a leading addon */
  export let hasLeading: boolean = false
  /** Whether there is a trailing addon */
  export let hasTrailing: boolean = false

  $: wrapperClasses = [
    'strand-input',
    error && 'strand-input--error',
    disabled && 'strand-input--disabled',
    hasLeading && 'strand-input--has-leading',
    hasTrailing && 'strand-input--has-trailing',
  ].filter(Boolean).join(' ')
</script>

<div class={wrapperClasses}>
  {#if hasLeading}
    <span class="strand-input__leading" aria-hidden="true">
      <slot name="leading" />
    </span>
  {/if}
  <input
    {type}
    class="strand-input__field"
    {disabled}
    aria-invalid={error ? 'true' : undefined}
    {...$$restProps}
  />
  {#if hasTrailing}
    <span class="strand-input__trailing" aria-hidden="true">
      <slot name="trailing" />
    </span>
  {/if}
</div>
