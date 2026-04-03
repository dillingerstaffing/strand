<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Label text */
  export let label: string
  /** Associates the label with a form control */
  export let htmlFor: string
  /** Hint text displayed below the input */
  export let hint: string | undefined = undefined
  /** Error text displayed below the input (replaces hint) */
  export let error: string | undefined = undefined
  /** Show required indicator */
  export let required: boolean = false

  $: classes = [
    'strand-form-field',
    error && 'strand-form-field--error',
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <label class="strand-form-field__label" for={htmlFor}>
    {label}
    {#if required}
      <span class="strand-form-field__required" aria-hidden="true">*</span>
    {/if}
  </label>
  <div class="strand-form-field__control">
    <slot />
  </div>
  {#if error}
    <p class="strand-form-field__error" id={`${htmlFor}-error`} role="alert">
      {error}
    </p>
  {:else if hint}
    <p class="strand-form-field__hint" id={`${htmlFor}-hint`}>
      {hint}
    </p>
  {/if}
</div>
