<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Hover/focus-triggered text popup anchored to a trigger element.

  @example
  ```svelte
  <script>
    import { Tooltip, Button } from '@dillingerstaffing/strand-svelte';
  </script>

  <Tooltip content="Save your progress" position="top">
    <Button variant="primary">Save</Button>
  </Tooltip>
  ```
-->
<script context="module" lang="ts">
  let tooltipCount = 0
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'

  /** Tooltip text */
  export let content: string
  /** Position relative to trigger */
  export let position: 'top' | 'right' | 'bottom' | 'left' = 'top'
  /** Delay in ms before showing */
  export let delay: number = 200
  /** Controlled visibility; bind it, or leave it undefined and let the tooltip own it */
  export let open: boolean | undefined = undefined
  /** Visibility to start with when uncontrolled */
  export let defaultOpen: boolean = false
  /** Called with the next visibility on hover, focus, Escape, and the delay elapsing */
  export let onopenchange: ((open: boolean) => void) | undefined = undefined

  const tooltipId = `strand-tooltip-${++tooltipCount}`
  let ownOpen = defaultOpen
  let timer: ReturnType<typeof setTimeout> | null = null
  $: isOpen = open ?? ownOpen

  function setOwn(next: boolean) {
    if (ownOpen === next) return
    ownOpen = next
    onopenchange?.(next)
  }

  function show() {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      setOwn(true)
    }, delay)
  }

  function hide() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    setOwn(false)
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) hide()
  }

  onDestroy(() => {
    if (timer !== null) clearTimeout(timer)
  })

  $: tooltipClasses = ['strand-tooltip', `strand-tooltip--${position}`, isOpen && 'strand-tooltip--visible'].filter(Boolean).join(' ')
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
  class="strand-tooltip__wrapper"
  on:mouseenter={show}
  on:mouseleave={hide}
  on:focusin={show}
  on:focusout={hide}
  on:keydown={onKeydown}
  aria-describedby={tooltipId}
  {...$$restProps}
>
  <slot /><span id={tooltipId} class={tooltipClasses} role="tooltip" aria-hidden={!isOpen}>{content}</span>
</span>
