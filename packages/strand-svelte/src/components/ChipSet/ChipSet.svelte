<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!-- Selectable chips that WRAP in a rail and SCROLL on a narrow viewport.
     multi renders aria-pressed toggles, single renders a radiogroup. It
     scrolls rather than clipping: a filter the reader cannot reach is not
     a filter. -->
<script lang="ts" context="module">
  export interface ChipSetItem {
    /** Stable identity, reported by `onselectionchange`. */
    id: string
    label: string
  }
</script>

<script lang="ts">
  export let items: ChipSetItem[] = []
  /** ids currently selected. */
  export let selected: string[] = []
  /** `multi` renders toggle buttons; `single` renders a radiogroup. */
  export let mode: 'multi' | 'single' = 'multi'
  /** `scroll` never wraps and scrolls sideways. */
  export let overflow: 'wrap' | 'scroll' = 'wrap'
  export let size: 'sm' | 'md' = 'md'
  /** Accessible name for the set. */
  export let label: string
  /** Called with the ids selected after the interaction. */
  export let onselectionchange: ((selected: string[]) => void) | undefined = undefined
  let className: string = ''
  export { className as class }

  let chips: HTMLButtonElement[] = []

  $: single = mode === 'single'
  $: classes = [
    'strand-chip-set',
    overflow === 'scroll' && 'strand-chip-set--scroll',
    size === 'sm' && 'strand-chip-set--sm',
    overflow === 'scroll' && 'strand-scroll-row',
    className,
  ].filter(Boolean).join(' ')
  $: focused = single ? (items.find((i) => selected.includes(i.id)) ?? items[0])?.id : undefined

  function toggle(id: string) {
    if (single) {
      onselectionchange?.([id])
      return
    }
    onselectionchange?.(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }
  function onKeyDown(e: KeyboardEvent) {
    if (!single || items.length === 0) return
    const current = Math.max(0, items.findIndex((i) => i.id === focused))
    const n = items.length
    const next: Record<string, number> = { ArrowRight: (current + 1) % n, ArrowLeft: (current - 1 + n) % n, Home: 0, End: n - 1 }
    if (!(e.key in next)) return
    e.preventDefault()
    const index = next[e.key]
    onselectionchange?.([items[index].id])
    chips[index]?.focus()
  }
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<div class={classes} role={single ? 'radiogroup' : 'group'} aria-label={label} on:keydown={onKeyDown} {...$$restProps}>
  {#each items as item, index (item.id)}
    <button
      bind:this={chips[index]}
      type="button"
      class="strand-chip-set__chip"
      role={single ? 'radio' : undefined}
      aria-pressed={single ? undefined : selected.includes(item.id)}
      aria-checked={single ? selected.includes(item.id) : undefined}
      tabindex={single ? (item.id === focused ? 0 : -1) : undefined}
      on:click={() => toggle(item.id)}
    >{item.label}</button>
  {/each}
</div>
