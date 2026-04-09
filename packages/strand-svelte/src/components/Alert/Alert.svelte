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
  /** Visual status of the alert */
  export let status: 'info' | 'success' | 'warning' | 'error' = 'info'
  /** Show dismiss button */
  export let dismissible: boolean = false
  /** Called when dismiss button is clicked */
  export let ondismiss: (() => void) | undefined = undefined

  $: role = status === 'error' || status === 'warning' ? 'alert' : 'status'

  $: classes = [
    'strand-alert',
    `strand-alert--${status}`,
  ].filter(Boolean).join(' ')

  const statusLabels: Record<string, string> = {
    info: 'INFO',
    success: 'COMPLETE',
    warning: 'WARNING',
    error: 'ERROR',
  }

  $: statusLabel = statusLabels[status] ?? status.toUpperCase()
</script>

<div class={classes} {role} {...$$restProps}>
  <span class="strand-alert__status">{statusLabel}</span>
  <div class="strand-alert__content">
    <slot />
  </div>
  {#if dismissible}
    <button
      type="button"
      class="strand-alert__dismiss"
      aria-label="Dismiss"
      on:click={() => ondismiss?.()}
    >
      &#215;
    </button>
  {/if}
</div>
