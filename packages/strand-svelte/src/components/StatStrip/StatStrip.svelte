<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!-- A row of labelled value cells, compared across rather than read singly.
     Renders as a <dl>: a row of divs would give a screen reader six
     unrelated strings instead of three pairs. -->
<script lang="ts">
  export interface StatStripItem { label: string; value: string }
  export let items: StatStripItem[] = []
  export let variant: 'plain' | 'bordered' = 'plain'
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-stat-strip', variant === 'bordered' ? 'strand-stat-strip--bordered' : '', className]
    .filter(Boolean).join(' ')
</script>

<dl class={classes} {...$$restProps}>
  {#each items as item (item.label)}
    <div class="strand-stat-strip__cell">
      <dt class="strand-stat-strip__label">{item.label}</dt>
      <dd class="strand-stat-strip__value">{item.value}</dd>
    </div>
  {/each}
</dl>
