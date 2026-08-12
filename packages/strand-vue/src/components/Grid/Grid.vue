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

interface Props {
  /** Number of equal-width columns. Ignored when minColWidth is set. */
  columns?: number
  /** Gap between items, maps to --strand-space-{n} */
  gap?: number
  /** Additional CSS class */
  className?: string
  /**
   * Minimum column width (px) for a responsive auto-fit track. When set, the
   * grid renders repeat(auto-fit, minmax(${minColWidth}px, 1fr)) and columns
   * is ignored.
   */
  minColWidth?: number
  /**
   * A fixed 264px rail beside a flexible main track, collapsing to one
   * column below the md breakpoint. Takes precedence over columns and
   * minColWidth. Put the rail FIRST in the markup: below the breakpoint
   * the regions stack in source order, and a filter met after the results
   * it filters is one the reader has already scrolled past.
   */
  sidebar?: boolean
  /** A flexible main track beside a fixed-width panel, collapsing to one
      column below md. `sidebar` mirrored. Set the width with
      --strand-split-panel (default 600px). Put the MAIN track first: the
      regions stack in source order below the breakpoint. */
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

// The sidebar preset lives in the stylesheet because its column
// definition changes at a breakpoint, and an inline style cannot carry a
// media query. This branch emits no gridTemplateColumns at all rather
// than one the class would then have to fight.
const inlineStyle = computed(() => ({
  ...(props.sidebar || props.split
    ? {}
    : {
        gridTemplateColumns:
          props.minColWidth != null
            ? `repeat(auto-fit, minmax(${props.minColWidth}px, 1fr))`
            : `repeat(${props.columns}, 1fr)`,
      }),
  gap: `var(--strand-space-${props.gap})`,
}))
</script>

<template>
  <div :class="classes" :style="inlineStyle" v-bind="$attrs">
    <slot />
  </div>
</template>
