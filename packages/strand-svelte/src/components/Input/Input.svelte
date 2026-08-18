<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Text input field with optional leading/trailing addons and error state.

  @example
  ```svelte
  <script>
    import { Input } from '@dillingerstaffing/strand-svelte';
  </script>

  <Input type="email" placeholder="you@example.com" />
  ```
-->
<script lang="ts">
  /** Input type */
  export let type: 'text' | 'email' | 'password' | 'search' | 'number' = 'text'
  /** Show error styling */
  export let error: boolean = false
  /** Disabled state */
  export let disabled: boolean = false
  $: wrapperClasses = [
    'strand-input',
    error && 'strand-input--error',
    disabled && 'strand-input--disabled',
    $$slots.leadingAddon && 'strand-input--has-leading',
    $$slots.trailingAddon && 'strand-input--has-trailing',
  ].filter(Boolean).join(' ')
</script>

<div class={wrapperClasses}>
  {#if $$slots.leadingAddon}
    <span class="strand-input__leading" aria-hidden="true"><slot name="leadingAddon" /></span>
  {/if}
  <input {type} class="strand-input__field" {disabled} aria-invalid={error ? 'true' : undefined} {...$$restProps} />
  {#if $$slots.trailingAddon}
    <span class="strand-input__trailing" aria-hidden="true"><slot name="trailingAddon" /></span>
  {/if}
</div>
