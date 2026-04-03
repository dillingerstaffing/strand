<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Tooltip text */
  export let content: string
  /** Position relative to trigger */
  export let position: 'top' | 'right' | 'bottom' | 'left' = 'top'
  /** Delay in ms before showing */
  export let delay: number = 200

  let visible = false
  let timer: ReturnType<typeof setTimeout> | null = null

  let tooltipIdCounter = 0
  const tooltipId = `strand-tooltip-${++tooltipIdCounter}`

  function show() {
    timer = setTimeout(() => {
      visible = true
    }, delay)
  }

  function hide() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    visible = false
  }

  $: tooltipClasses = [
    'strand-tooltip',
    `strand-tooltip--${position}`,
    visible && 'strand-tooltip--visible',
  ].filter(Boolean).join(' ')
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
  class="strand-tooltip__wrapper"
  on:mouseenter={show}
  on:mouseleave={hide}
  on:focus={show}
  on:blur={hide}
  aria-describedby={tooltipId}
  {...$$restProps}
>
  <slot />
  <span
    id={tooltipId}
    class={tooltipClasses}
    role="tooltip"
    aria-hidden={!visible}
  >
    {content}
  </span>
</span>
