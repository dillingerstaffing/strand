<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Standalone notification message with status indicator and optional dismiss.

  @example
  ```svelte
  <script>
    import { Toast } from '@dillingerstaffing/strand-svelte';
  </script>

  <Toast status="success" message="Changes saved." ondismiss={() => {}} />
  ```
-->
<script lang="ts">
  import type { ToastStatus } from './useToast'

  /** Visual status */
  export let status: ToastStatus = 'info'
  /** Toast message text */
  export let message: string
  /** Called when dismiss button is clicked */
  export let ondismiss: (() => void) | undefined = undefined

  $: isUrgent = status === 'error' || status === 'warning'
  $: classes = [
    'strand-toast',
    `strand-toast--${status}`,
  ].filter(Boolean).join(' ')

  const statusLabels: Record<string, string> = {
    info: 'INFO',
    success: 'COMPLETE',
    warning: 'WARNING',
    error: 'ERROR',
  }

  $: statusLabel = statusLabels[status] ?? status.toUpperCase()
</script>

<div class={classes} role="status" aria-live={isUrgent ? 'assertive' : 'polite'} {...$$restProps}>
  <span class="strand-toast__status">{statusLabel}</span>
  <span class="strand-toast__message">{message}</span>
  <button
    type="button"
    class="strand-toast__dismiss"
    aria-label="Dismiss"
    on:click={() => ondismiss?.()}
  >
    &#215;
  </button>
</div>
