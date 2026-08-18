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
  /** Called on every input event, after the bound value updates */
  export let oninput: ((e: Event) => void) | undefined = undefined

  let textareaEl: HTMLTextAreaElement

  $: wrapperClasses = [
    'strand-textarea',
    error && 'strand-textarea--error',
    disabled && 'strand-textarea--disabled',
    autoResize && 'strand-textarea--auto-resize',
  ].filter(Boolean).join(' ')

  $: currentLength = typeof value === 'string' ? value.length : 0

  /** Fits the textarea to its content; a zero scrollHeight means no layout engine is running, so the element is left as it was. */
  function fit() {
    const el = textareaEl
    if (!autoResize || !el) return
    const previous = el.style.height
    el.style.height = 'auto'
    const content = el.scrollHeight
    if (content > 0) el.style.height = `${content}px`
    else if (previous) el.style.height = previous
    else if (el.style.length === 0 || (el.style.length === 1 && el.style.height === 'auto')) el.removeAttribute('style')
  }
  $: if (textareaEl && value !== undefined) fit()

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement
    value = target.value
    fit()
    oninput?.(e)
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
