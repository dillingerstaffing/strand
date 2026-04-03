<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  import { onDestroy } from 'svelte'
  import { createToastContext } from './useToast'
  import type { ToastEntry } from './useToast'

  const ctx = createToastContext()
  const { toasts, removeToast } = ctx

  let toastList: ToastEntry[] = []
  const unsubscribe = toasts.subscribe((value) => {
    toastList = value
  })

  function isUrgent(status: string): boolean {
    return status === 'error' || status === 'warning'
  }

  const statusLabels: Record<string, string> = {
    info: 'INFO',
    success: 'COMPLETE',
    warning: 'WARNING',
    error: 'ERROR',
  }

  function statusLabel(status: string): string {
    return statusLabels[status] ?? status.toUpperCase()
  }

  onDestroy(() => {
    unsubscribe()
  })
</script>

<slot />
{#if toastList.length > 0}
  <div class="strand-toast__container">
    {#each toastList as entry (entry.id)}
      <div
        class={['strand-toast', `strand-toast--${entry.status}`].join(' ')}
        role="status"
        aria-live={isUrgent(entry.status) ? 'assertive' : 'polite'}
      >
        <span class="strand-toast__status">{statusLabel(entry.status)}</span>
        <span class="strand-toast__message">{entry.message}</span>
        <button
          type="button"
          class="strand-toast__dismiss"
          aria-label="Dismiss"
          on:click={() => removeToast(entry.id)}
        >
          &#215;
        </button>
      </div>
    {/each}
  </div>
{/if}
