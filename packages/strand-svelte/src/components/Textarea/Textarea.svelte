<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Multi-line text input with auto-resize, character count, and error state.

  @example
  ```svelte
  <script>
    import { Textarea } from '@dillingerstaffing/strand-svelte';
    let text = '';
  </script>

  <Textarea bind:value={text} maxLength={500} showCount autoResize />
  ```
-->
<script lang="ts">
  /** Auto-resize to fit content */
  export let autoResize: boolean = false
  /** Show character count (requires maxLength) */
  export let showCount: boolean = false
  /** Show error styling */
  export let error: boolean = false
  /** Maximum character count */
  export let maxLength: number | undefined = undefined
  /** Disabled state */
  export let disabled: boolean = false
  /** Controlled value */
  export let value: string = ''

  let textareaEl: HTMLTextAreaElement

  $: wrapperClasses = [
    'strand-textarea',
    error && 'strand-textarea--error',
    disabled && 'strand-textarea--disabled',
    autoResize && 'strand-textarea--auto-resize',
  ].filter(Boolean).join(' ')

  $: currentLength = typeof value === 'string' ? value.length : 0

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement
    value = target.value
    if (autoResize && textareaEl) {
      textareaEl.style.height = 'auto'
      textareaEl.style.height = `${textareaEl.scrollHeight}px`
    }
  }
</script>

<div class={wrapperClasses}>
  <textarea
    bind:this={textareaEl}
    class="strand-textarea__field"
    {disabled}
    aria-invalid={error ? 'true' : undefined}
    maxlength={maxLength}
    {value}
    on:input={handleInput}
    {...$$restProps}
  ></textarea>
  {#if showCount && maxLength != null}
    <span class="strand-textarea__count" aria-live="polite">
      {currentLength}/{maxLength}
    </span>
  {/if}
</div>
