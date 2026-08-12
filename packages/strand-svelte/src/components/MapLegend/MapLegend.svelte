<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  The category key for an instrument viewport's map. The four sector
  colours are the only place the Blue Discipline is relaxed (9.3): here
  the colour is data rather than decoration. An item is a button when it
  filters and a plain row when it does not.
-->
<script lang="ts">
  export interface MapLegendItem {
    category: 'tech' | 'health' | 'trades' | 'finance'
    label: string
    /** Present means the row filters, so it renders as a button. */
    selectable?: boolean
  }
  export let title: string = 'Legend'
  export let items: MapLegendItem[] = []
  export let onselect: ((category: string) => void) | undefined = undefined
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-map-legend', className].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <div class="strand-map-legend__title">{title}</div>
  {#each items as item (item.category)}
    {#if item.selectable}
      <button type="button" class="strand-map-legend__item" on:click={() => onselect?.(item.category)}>
        <span class="strand-map-legend__dot strand-map-legend__dot--{item.category}" aria-hidden="true"></span>
        {item.label}
      </button>
    {:else}
      <div class="strand-map-legend__item">
        <span class="strand-map-legend__dot strand-map-legend__dot--{item.category}" aria-hidden="true"></span>
        {item.label}
      </div>
    {/if}
  {/each}
</div>
