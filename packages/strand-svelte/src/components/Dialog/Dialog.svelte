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
  /**
   * Where the panel sits in the viewport. `center` is right for a
   * confirmation. `start` drops it under the reader's gaze, which is where
   * a search or command overlay belongs: centred, a fixed-height panel
   * straddles the fold on a short viewport and its input is the last thing
   * the eye reaches.
   *
   * `end` anchors the panel to the bottom edge as a SHEET: full-bleed,
   * top-only radius, slide-up entrance. This is the pattern DL 11.6 names,
   * and it exists because 14.8 requires a touch view's primary action to
   * reach the bottom third of the viewport, which a centred panel cannot do
   * at any height. Prefer `Sheet`, which composes this with the grabber, the
   * scrolling body and the drag gesture the pattern also owns.
   */
  export let align: 'center' | 'start' | 'end' = 'center'
  /**
   * Inner padding. The same ladder `Card` carries, at the same values.
   * `none` also clips content to the panel's radius, for panels whose
   * children carry their own inset (a query row, a scrolling list).
   */
  export let padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'lg'
  /**
   * Whether to render the close button. Set `false` for overlays whose
   * convention has no X and whose dismissal is Escape or the backdrop.
   * Escape and backdrop dismissal are unaffected.
   */
  export let dismissible: boolean = true
  /** Called when the dialog should close */
  export let onclose: (() => void) | undefined = undefined

  $: panelClasses = [
    'strand-dialog__panel',
    align === 'center' ? '' : `strand-dialog__panel--align-${align}`,
    `strand-dialog__panel--pad-${padding}`,
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
