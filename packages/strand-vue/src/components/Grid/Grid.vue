<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  CSS Grid layout with configurable column count and gap spacing.

  @example
  ```vue
  <script setup>
  import { Grid, Card } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Grid :columns="3" :gap="6">
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
    </Grid>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'
import { resolveGapStep } from '../../spacing'

interface Props {
  /** Number of equal-width columns. Ignored when minColWidth is set. */
  columns?: number
  /** Gap between items, maps to --strand-space-{n} */
  gap?: number
  /** Additional CSS class */
  className?: string
  /** Minimum column width (px) for a responsive auto-fit track. */
  minColWidth?: number
  /** A fixed 264px rail beside a flexible main track, collapsing to one column below the md breakpoint. */
  sidebar?: boolean
  /** A flexible main track beside a fixed-width panel, collapsing to one column below md. */
  split?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: 1,
  gap: 4,
  className: '',
  minColWidth: undefined,
  sidebar: false,
  split: false,
})

const classes = computed(() =>
  [
    'strand-grid',
    props.sidebar ? 'strand-grid--sidebar' : '',
    props.split ? 'strand-grid--split' : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

// The sidebar preset lives in the stylesheet: its columns change at a breakpoint (cf: grid-tracks).
const inlineStyle = computed(() => ({
  ...(props.sidebar || props.split
    ? {}
    : {
        // `minmax(0, 1fr)`, never a bare `1fr` (cf: grid-tracks).
        gridTemplateColumns:
          props.minColWidth != null
            ? `repeat(auto-fit, minmax(${props.minColWidth}px, 1fr))`
            : `repeat(${props.columns}, minmax(0, 1fr))`,
      }),
  gap: `var(--strand-space-${resolveGapStep(props.gap)})`,
}))
</script>

<template>
  <div :class="classes" :style="inlineStyle" v-bind="$attrs">
    <slot />
  </div>
</template>
