<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Modal overlay with focus trapping, scroll lock, and backdrop click dismissal.

  @example
  ```svelte
  <script>
    import { Dialog } from '@dillingerstaffing/strand-svelte';
    let isOpen = false;
  </script>

  <Dialog open={isOpen} title="Confirm" onclose={() => isOpen = false}>
    <p>Are you sure?</p>
  </Dialog>
  ```
-->
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
  /** Where the panel sits in the viewport. */
  export let align: 'center' | 'start' | 'end' = 'center'
  /** Inner padding. */
  export let padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'lg'
  /** Whether to render the close button. */
  export let dismissible: boolean = true
  /** Called when the dialog should close */
  export let onclose: (() => void) | undefined = undefined
  /** The element to focus when the dialog opens; the first focusable child by default */
  export let initialFocus: HTMLElement | null = null

  let className: string = ''
  export { className as class }

  $: panelClasses = [
    'strand-dialog__panel',
    align === 'center' ? '' : `strand-dialog__panel--align-${align}`,
    `strand-dialog__panel--pad-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

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
    if (initialFocus) {
      initialFocus.focus({ preventScroll: true })
    } else if (panelEl) {
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
    <!-- `$$restProps` lands on the PANEL, and it has to be said explicitly
         because Svelte forwards nothing to a component's DOM by default.
         Measured before this line existed: `<Dialog aria-label="Filters">`
         dropped the name entirely, so every composed overlay in this consumer
         announced as an unnamed dialog. The Preact build spreads `...rest`
         here and the Vue build now binds `$attrs` here, so all three agree on
         which box carries the accessible name: the one with role="dialog". -->
    <div
      bind:this={panelEl}
      class={panelClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      tabindex={-1}
      {...$$restProps}
    >
      {#if title}
        <div class="strand-dialog__header">
          <h2 id={titleId} class="strand-dialog__title">{title}</h2>
        </div>
      {/if}
      {#if dismissible}
        <button
          type="button"
          class="strand-dialog__close"
          aria-label="Close"
          on:click={() => onclose?.()}
        >
          &#215;
        </button>
      {/if}
      <div class="strand-dialog__body">
        <slot />
      </div>
    </div>
  </div>
{/if}
