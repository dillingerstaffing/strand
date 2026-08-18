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

  // cf: spacing-ladder
  $: classes = [
    'strand-stack',
    `strand-stack--${direction}`,
    `strand-stack--gap-${resolveGapStep(gap)}`,
    align !== 'stretch' && `strand-stack--align-${align}`,
    justify && `strand-stack--justify-${justify}`,
    wrap && 'strand-stack--wrap',
  ].filter(Boolean).join(' ')
</script>

<svelte:element this={as} class={classes} {...$$restProps}>
  <slot />
</svelte:element>
