<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Contextual feedback banner for status messages, warnings, and errors.

  @example
  ```svelte
  <script>
    import { Alert } from '@dillingerstaffing/strand-svelte';
  </script>

  <Alert status="success" dismissible ondismiss={() => {}}>
    Operation completed successfully.
  </Alert>
  ```
-->
<script lang="ts">
  /** Severity; error and warning announce assertively. */
  export let status: 'info' | 'success' | 'warning' | 'error' = 'info'
  /** Show the dismiss control. */
  export let dismissible: boolean = false
  /** Called when the dismiss control is pressed. */
  export let ondismiss: (() => void) | undefined = undefined
  /** Accessible name of the dismiss control. */
  export let dismissLabel: string = 'Dismiss'
  /** Heading set above the message; the `title` slot takes markup. */
  export let title: string | undefined = undefined

  $: role = status === 'error' || status === 'warning' ? 'alert' : 'status'
  $: statusLabel = status === 'success' ? 'COMPLETE' : status.toUpperCase()
</script>

<div class={`strand-alert strand-alert--${status}`} {role} {...$$restProps}>
  <span class="strand-alert__status">{statusLabel}</span>
  <div class="strand-alert__content">
    {#if title || $$slots.title}
      <div class="strand-alert__title"><slot name="title">{title}</slot></div>
    {/if}<slot /></div>
  {#if $$slots.action}
    <div class="strand-alert__action"><slot name="action" /></div>
  {/if}
  {#if dismissible}
    <button type="button" class="strand-alert__dismiss" aria-label={dismissLabel} on:click={() => ondismiss?.()}>&#215;</button>
  {/if}
</div>
