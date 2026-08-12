<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  The list an instrument returns for a query.

  Three states, not two, deliberately: a failed request and an empty
  result are different answers and the user is owed the difference.
  "0 matches detected" means the instrument ran; an error means it did not.
-->
<script lang="ts">
  /** Instrument voice: "12 matches detected". */
  export let count: string | undefined = undefined
  export let visible: boolean = true
  export let state: 'results' | 'empty' | 'error' = 'results'
  export let stateTitle: string | undefined = undefined
  export let stateHint: string | undefined = undefined
  export let retryLabel: string = 'Retry'
  /** Renders the retry control in the error state. */
  export let retryable: boolean = false
  export let label: string = 'Results'
  export let onretry: (() => void) | undefined = undefined
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-results-panel', className].filter(Boolean).join(' ')
</script>

<section class={classes} aria-label={label} hidden={!visible} {...$$restProps}>
  <!-- Polite, not assertive: a count re-announcing on every keystroke of a
       live search interrupts more than it informs. -->
  {#if count}<div class="strand-results-panel__count" aria-live="polite">{count}</div>{/if}
  {#if state === 'results'}
    <div class="strand-results-panel__items"><slot /></div>
  {:else}
    <div class="strand-results-panel__state">
      {#if stateTitle}<div class="strand-results-panel__state-title">{stateTitle}</div>{/if}
      {#if stateHint}<div class="strand-results-panel__state-hint">{stateHint}</div>{/if}
      {#if state === 'error' && retryable}
        <button type="button" class="strand-results-panel__error-link" on:click={() => onretry?.()}>{retryLabel}</button>
      {/if}
    </div>
  {/if}
</section>
