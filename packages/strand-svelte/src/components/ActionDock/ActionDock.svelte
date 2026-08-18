<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  A bottom-anchored region carrying the primary action of a view, placed
  where a thumb rests.

  Implements design-language.md 14.8 (target position). 14.7 makes a target
  hittable; this makes it reachable. Thin wrapper over the
  `.strand-actiondock` classes.

  Use it for the ONE action a view exists to produce, and show it only while
  the in-flow control it stands in for is off screen. A dock competing with
  the real control is two live buttons for one action.

  Accessibility: the docked control usually duplicates one already in the
  accessibility tree, so give the copy `aria-hidden` and a `tabindex="-1"`
  control to avoid a duplicate announcement and tab stop. Reach is a thumb
  problem; a keyboard user gains nothing from the copy.

  @example
  ```svelte
  <script>
    import { ActionDock, Button } from '@dillingerstaffing/strand-svelte'
  </script>

  <ActionDock visible={!primaryControlOnScreen} aria-hidden="true">
    <Button variant="primary" tabindex={-1} on:click={rsvp}>RSVP</Button>
  </ActionDock>
  ```
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  /** Showing; ignored when `watch` is set. */
  export let visible: boolean = false
  /** The in-flow control this dock stands in for; the dock shows itself while that control is off screen. */
  export let watch: Element | null = null
  /** When to show while watching; only `"hidden"` today. */
  export let revealWhen: 'hidden' = 'hidden'
  /** Additional CSS class, merged with the component's own. */
  let className: string = ''
  export { className as class }

  let self: HTMLDivElement
  let selfDriven = false
  let inset = 0
  let stopObserving: (() => void) | null = null
  let resize: ResizeObserver | null = null

  /** Whether `el` is outside the viewport trimmed by `inset` px at the bottom (cf: actiondock-reveal). */
  function observeOffScreen(el: Element, onChange: (offScreen: boolean) => void, insetPx = 0): () => void {
    if (typeof IntersectionObserver !== 'function') return () => {}
    const io = new IntersectionObserver(([entry]) => onChange(entry.intersectionRatio < 1), {
      rootMargin: `0px 0px -${Math.max(0, Math.round(insetPx))}px 0px`,
      threshold: [0, 1],
    })
    io.observe(el)
    return () => io.disconnect()
  }

  function observe(target: Element | null, when: 'hidden', insetPx: number) {
    stopObserving?.()
    stopObserving = null
    if (!target || when !== 'hidden') return
    stopObserving = observeOffScreen(target, (off) => { selfDriven = off }, insetPx)
  }

  onMount(() => {
    if (self && typeof ResizeObserver === 'function') {
      resize = new ResizeObserver(() => {
        const h = self.offsetHeight
        if (Math.abs(inset - h) > 1) inset = h
      })
      resize.observe(self)
    }
  })
  $: observe(watch, revealWhen, inset)
  onDestroy(() => {
    stopObserving?.()
    resize?.disconnect()
  })

  $: showing = watch ? selfDriven : visible
</script>

<div
  bind:this={self}
  class={['strand-actiondock', className].filter(Boolean).join(' ')}
  data-strand-actiondock={showing ? 'visible' : 'hidden'}
  {...$$restProps}
>
  <slot />
</div>
