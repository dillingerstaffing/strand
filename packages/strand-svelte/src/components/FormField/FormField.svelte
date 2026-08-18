<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Form control wrapper providing label, hint text, error messaging, and required indicator.

  @example
  ```svelte
  <script>
    import { FormField, Input } from '@dillingerstaffing/strand-svelte';
  </script>

  <FormField label="Email" htmlFor="email" hint="Work email preferred" required>
    <Input id="email" type="email" />
  </FormField>
  ```
-->
<script lang="ts">
  /** Label text */
  export let label: string
  /** Associates the label with a form control */
  export let htmlFor: string
  /** Hint text displayed below the input */
  export let hint: string | undefined = undefined
  /** Error text displayed below the input (replaces hint) */
  export let error: string | undefined = undefined
  /**
   * Confirmation text displayed below the input (replaces hint, yields to error).
   *
   * For a value that has been CHECKED and found good: an available username, a
   * verified address, a valid coupon. Announced politely where `error` is
   * assertive, because success arrives while the member is still typing and an
   * assertive region would interrupt a screen reader to deliver good news.
   */
  export let success: string | undefined = undefined
  /** Show required indicator */
  export let required: boolean = false

  $: classes = [
    'strand-form-field',
    error && 'strand-form-field--error',
    !error && success && 'strand-form-field--success',
  ].filter(Boolean).join(' ')

  $: messageId = error
    ? `${htmlFor}-error`
    : success
      ? `${htmlFor}-success`
      : hint
        ? `${htmlFor}-hint`
        : undefined

  // Point the labelled control at whichever message is showing.
  //
  // SAME BEHAVIOUR AS THE PREACT AND VUE BUILDS, DIFFERENT MECHANISM, AND THE
  // DIFFERENCE IS FORCED BY THE RENDERER RATHER THAN CHOSEN.
  //
  // Those two clone the child vnode (cloneElement / cloneVNode) so the
  // description is part of the same render that produces the message. Svelte
  // has no equivalent: slot content is compiled into the PARENT's fragment and
  // is opaque here, so there is no node to clone.
  //
  // Writing the attribute is safe in Svelte specifically, and would not be in
  // Preact. Svelte compiles targeted update code only for attributes that
  // appear in a template, so an attribute no one templated is never diffed and
  // never clobbered. Preact re-diffs the whole vnode subtree on every parent
  // render, which is why the same write there would be a race.
  //
  // Consumer-set values survive: the field removes only the ids it mints.
  let fieldEl: HTMLDivElement | undefined

  function syncDescribedBy(root: HTMLElement | undefined, id: string, msg: string | undefined) {
    if (!root || !id) return
    const escaped =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(id)
        : id.replace(/["\\]/g, '\\$&')
    const control = root.querySelector(`#${escaped}`)
    if (!control) return
    const owned = [`${id}-error`, `${id}-success`, `${id}-hint`]
    const existing = (control.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((x) => x && !owned.includes(x))
    const next = msg ? [...existing, msg] : existing
    if (next.length > 0) control.setAttribute('aria-describedby', next.join(' '))
    else control.removeAttribute('aria-describedby')
  }

  $: syncDescribedBy(fieldEl, htmlFor, messageId)
</script>

<div class={classes} bind:this={fieldEl} {...$$restProps}>
  <label class="strand-form-field__label" for={htmlFor}>{label}{#if required}<span class="strand-form-field__required" aria-hidden="true">*</span>{/if}</label>
  <div class="strand-form-field__control">
    <slot />
  </div>
  <!-- ONE message slot, precedence error > success > hint. A field showing
       "that name is taken" above "Available." argues with itself, so the
       states are exclusive here rather than at each call site. -->
  {#if error}
    <p class="strand-form-field__error" id={`${htmlFor}-error`} role="alert">
      {error}
    </p>
  {:else if success}
    <p class="strand-form-field__success" id={`${htmlFor}-success`} role="status">
      {success}
    </p>
  {:else if hint}
    <p class="strand-form-field__hint" id={`${htmlFor}-hint`}>
      {hint}
    </p>
  {/if}
</div>
