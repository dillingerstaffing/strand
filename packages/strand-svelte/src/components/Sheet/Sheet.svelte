<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Bottom-anchored modal: the pattern DL 11.6 names and 14.8 requires.

  Composes Dialog, so focus trapping, focus restoration, scroll lock and
  Escape dismissal are inherited rather than reimplemented here. What this
  adds is the anatomy the pattern owns: a head that does not scroll, a body
  that does, a foot holding the committing control in the thumb's reach, and
  a grabber that both states and implements drag-to-dismiss.

  WHY THE DRAG LIVES HERE AND NOT IN THE CONSUMER. The gesture has one
  non-obvious requirement and every hand-rolled version gets it wrong the same
  way: dismissing means dragging DOWN and away from a 28px strip, so without
  `setPointerCapture` the moves stop arriving almost immediately and the sheet
  springs back as though the gesture had been abandoned.

  @example
  ```svelte
  <script>
    import { Sheet, Button } from '@dillingerstaffing/strand-svelte';
    let open = false;
  </script>

  <Sheet {open} label="Filters" onclose={() => (open = false)}>
    <FilterControls />
    <svelte:fragment slot="action">
      <Button variant="primary" onclick={() => (open = false)}>Show 6 events</Button>
    </svelte:fragment>
  </Sheet>
  ```
-->
<script lang="ts">
  import Dialog from '../Dialog/Dialog.svelte'

  /** Whether the sheet is open */
  export let open: boolean = false
  /** Accessible name. A sheet has no visible heading, so this is the only one. */
  export let label: string = ''
  /**
   * Whether the sheet can be dragged away.
   *
   * `false` removes the grabber rather than leaving one that does nothing. An
   * affordance that promises a gesture it does not have is worse than none.
   */
  export let draggable: boolean = true
  /** Called when the sheet should close */
  export let onclose: (() => void) | undefined = undefined

  /** Past this fraction of the sheet's OWN height, a drag closes it. */
  const DISMISS_FRACTION = 0.28

  let drag = 0
  let startY: number | null = null
  let panelEl: HTMLDivElement

  function handlePointerDown(e: PointerEvent) {
    // A press with no usable coordinate starts no drag. Storing a null would
    // make every later handler's "has a drag begun" check answer yes to a
    // gesture that can never be measured.
    if (!Number.isFinite(e.clientY)) return
    startY = e.clientY
    // CAPTURE, or the drag stops tracking the moment the pointer leaves the
    // grabber, which is immediately.
    ;(e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    if (startY === null) return
    // Downward only. An upward drag is a request for more sheet, and this one
    // is already at its height.
    drag = Math.max(0, e.clientY - startY)
  }

  function handlePointerUp(e: PointerEvent) {
    if (startY === null) return
    ;(e.currentTarget as HTMLElement | null)?.releasePointerCapture?.(e.pointerId)
    const height = panelEl?.getBoundingClientRect().height || 1
    const travelled = Math.max(0, e.clientY - startY)
    startY = null
    drag = 0
    // A fraction of the sheet's OWN height, so the same gesture means the same
    // thing on a short phone and a tall one.
    if (travelled > height * DISMISS_FRACTION) onclose?.()
  }

  // A cancelled pointer is an ABANDONED gesture, not a completed one. Routing
  // it through the release path would let the OS taking the pointer away
  // dismiss the sheet on the reader's behalf.
  function handlePointerCancel() {
    startY = null
    drag = 0
  }

  $: if (open) drag = 0
</script>

<Dialog
  {open}
  align="end"
  padding="none"
  dismissible={false}
  aria-label={label}
  onclose={() => onclose?.()}
>
  <div
    bind:this={panelEl}
    class="strand-sheet__panel"
    style={drag ? `transform: translateY(${drag}px)` : undefined}
  >
    {#if draggable}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="strand-sheet__grab"
        data-testid="sheet-grab"
        on:pointerdown={handlePointerDown}
        on:pointermove={handlePointerMove}
        on:pointerup={handlePointerUp}
        on:pointercancel={handlePointerCancel}
      >
        <span class="strand-sheet__grabber" aria-hidden="true"></span>
      </div>
    {/if}

    {#if $$slots.head}
      <div class="strand-sheet__head" data-testid="sheet-head">
        <slot name="head" />
      </div>
    {/if}

    <div class="strand-sheet__body">
      <slot />
    </div>

    {#if $$slots.action}
      <div class="strand-sheet__foot" data-testid="sheet-foot">
        <slot name="action" />
      </div>
    {/if}
  </div>
</Dialog>
