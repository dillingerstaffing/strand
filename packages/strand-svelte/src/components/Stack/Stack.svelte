<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Flexbox layout container for arranging children with consistent spacing.

  @example
  ```svelte
  <script>
    import { Stack, Button } from '@dillingerstaffing/strand-svelte';
  </script>

  <Stack direction="horizontal" gap={4} align="center">
    <Button variant="primary">Save</Button>
    <Button variant="secondary">Cancel</Button>
  </Stack>
  ```
-->
<script lang="ts">
  import { resolveGapStep } from '../../spacing.js'
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

  /** Root element */
  export let as: string = 'div'

  $: classes = [
    'strand-stack',
    `strand-stack--${direction}`,
    align !== 'stretch' && `strand-stack--align-${align}`,
    justify && `strand-stack--justify-${justify}`,
    wrap && 'strand-stack--wrap',
  ].filter(Boolean).join(' ')

  // THE LADDER IS THE CONTRACT (gap #122). An off-ladder gap wrote an
  // undefined token, and an undefined custom property invalidates the
  // whole declaration: the result was NO gap, not a smaller one.
  $: gapStep = resolveGapStep(gap)
  $: inlineStyle = `gap: var(--strand-space-${gapStep});`
</script>

<svelte:element this={as} class={classes} style={inlineStyle} {...$$restProps}>
  <slot />
</svelte:element>
