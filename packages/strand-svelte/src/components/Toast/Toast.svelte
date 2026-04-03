<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
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
</script>

<div class={classes} role="status" aria-live={isUrgent ? 'assertive' : 'polite'} {...$$restProps}>
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
