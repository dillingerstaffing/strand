<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Flex direction */
  export let direction: 'vertical' | 'horizontal' = 'vertical'
  /** Gap between items, maps to --strand-space-{n} */
  export let gap: number = 4
  /** Cross-axis alignment */
  export let align: 'start' | 'center' | 'end' | 'stretch' = 'stretch'
  /** Main-axis alignment */
  export let justify: 'start' | 'center' | 'end' | 'between' | 'around' | undefined = undefined
  /** Enable flex-wrap */
  export let wrap: boolean = false

  $: classes = [
    'strand-stack',
    `strand-stack--${direction}`,
    align !== 'stretch' && `strand-stack--align-${align}`,
    justify && `strand-stack--justify-${justify}`,
    wrap && 'strand-stack--wrap',
  ].filter(Boolean).join(' ')

  $: inlineStyle = `gap: var(--strand-space-${gap});`
</script>

<div class={classes} style={inlineStyle} {...$$restProps}>
  <slot />
</div>
