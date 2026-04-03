<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  import { onDestroy, tick } from 'svelte'

  /** Whether the dialog is open */
  export let open: boolean = false
  /** Optional title rendered in the dialog header */
  export let title: string | undefined = undefined
  /** Close when clicking the backdrop */
  export let closeOnOutsideClick: boolean = true
  /** Close when pressing Escape */
  export let closeOnEscape: boolean = true
  /** Called when the dialog should close */
  export let onclose: (() => void) | undefined = undefined

  const FOCUSABLE_SELECTOR =
    'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'

  let dialogIdCounter = 0
  const titleId = `strand-dialog-title-${++dialogIdCounter}`

  let panelEl: HTMLDivElement
  let previousFocus: Element | null = null
  let originalOverflow = ''

  $: if (open) {
    onOpen()
  } else {
    onCloseCleanup()
  }

  async function onOpen() {
    previousFocus = document.activeElement
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    await tick()
    if (panelEl) {
      const focusable = panelEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        panelEl.focus()
      }
    }
  }

  function onCloseCleanup() {
    if (originalOverflow !== undefined) {
      document.body.style.overflow = originalOverflow
    }
    if (previousFocus && previousFocus instanceof HTMLElement) {
      previousFocus.focus()
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && closeOnEscape) {
      e.stopPropagation()
      onclose?.()
      return
    }

    if (e.key === 'Tab' && panelEl) {
      const focusable = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onclose?.()
    }
  }

  onDestroy(() => {
    if (open) {
      document.body.style.overflow = originalOverflow
    }
  })
</script>

{#if open}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="strand-dialog__backdrop"
    on:click={handleBackdropClick}
    on:keydown={handleKeyDown}
  >
    <div
      bind:this={panelEl}
      class="strand-dialog__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      tabindex={-1}
    >
      {#if title}
        <div class="strand-dialog__header">
          <h2 id={titleId} class="strand-dialog__title">{title}</h2>
        </div>
      {/if}
      <button
        type="button"
        class="strand-dialog__close"
        aria-label="Close"
        on:click={() => onclose?.()}
      >
        &#215;
      </button>
      <div class="strand-dialog__body">
        <slot />
      </div>
    </div>
  </div>
{/if}
