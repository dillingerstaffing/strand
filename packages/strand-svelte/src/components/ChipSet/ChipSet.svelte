<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!-- Selectable chips that WRAP in a rail and SCROLL on a narrow viewport.
     multi renders aria-pressed toggles, single renders a radiogroup. It
     scrolls rather than clipping: a filter the reader cannot reach is not
     a filter. -->
<script lang="ts">
  export interface ChipSetItem { id: string; label: string }
  export let items: ChipSetItem[] = []
  export let selected: string[] = []
  export let mode: 'multi' | 'single' = 'multi'
  export let overflow: 'wrap' | 'scroll' = 'wrap'
  export let label: string
  export let onselectionchange: ((selected: string[]) => void) | undefined = undefined
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = [
    'strand-chip-set',
    overflow === 'scroll' ? 'strand-chip-set--scroll' : '',
    overflow === 'scroll' ? 'strand-scroll-row' : '',
    className,
  ].filter(Boolean).join(' ')
  function toggle(id: string) {
    if (mode === 'single') { onselectionchange?.([id]); return }
    onselectionchange?.(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }
</script>

<div class={classes} role={mode === 'single' ? 'radiogroup' : 'group'} aria-label={label} {...$$restProps}>
  {#each items as item (item.id)}
    <button
      type="button"
      class="strand-chip-set__chip"
      role={mode === 'single' ? 'radio' : undefined}
      aria-pressed={mode === 'multi' ? selected.includes(item.id) : undefined}
      aria-checked={mode === 'single' ? selected.includes(item.id) : undefined}
      on:click={() => toggle(item.id)}
    >{item.label}</button>
  {/each}
</div>
