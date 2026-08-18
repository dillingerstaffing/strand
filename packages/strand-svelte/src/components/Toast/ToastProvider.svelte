<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Context provider that manages toast notifications for its subtree.

  @example
  ```svelte
  <script>
    import { ToastProvider } from '@dillingerstaffing/strand-svelte';
  </script>

  <ToastProvider>
    <App />
  </ToastProvider>
  ```
-->
<script lang="ts">
  import { onDestroy } from 'svelte'
  import { createToastContext } from './useToast'
  import type { ToastEntry } from './useToast'

  /** How many toasts show at once; the oldest leaves when a new one arrives past it. Unbounded by default. */
  export let maxCount: number = Number.POSITIVE_INFINITY
  /** Auto-dismiss waits while the pointer or focus is on a toast (WCAG 2.2.1). */
  export let pauseOnHover: boolean = true

  const ctx = createToastContext({ maxCount, pauseOnHover })
  const { toasts, dismiss, hold, release } = ctx

  let toastList: ToastEntry[] = []
  const unsubscribe = toasts.subscribe((value) => {
    toastList = value
  })

  function isUrgent(status: string): boolean {
    return status === 'error' || status === 'warning'
  }

  const statusLabels: Record<string, string> = { info: 'INFO', success: 'COMPLETE', warning: 'WARNING', error: 'ERROR' }

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
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class={['strand-toast', `strand-toast--${entry.status}`].join(' ')}
        role={isUrgent(entry.status) ? 'alert' : 'status'}
        aria-live={isUrgent(entry.status) ? 'assertive' : 'polite'}
        on:mouseenter={() => hold(entry.id)}
        on:mouseleave={() => release(entry.id)}
        on:focusin={() => hold(entry.id)}
        on:focusout={() => release(entry.id)}
      >
        <span class="strand-toast__status">{statusLabel(entry.status)}</span>
        <span class="strand-toast__message">{entry.message}</span>
        <button type="button" class="strand-toast__dismiss" aria-label="Dismiss" on:click={() => dismiss(entry.id)}>
          &#215;
        </button>
      </div>
    {/each}
  </div>
{/if}
