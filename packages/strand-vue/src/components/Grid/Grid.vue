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
}

const props = withDefaults(defineProps<Props>(), {
  columns: 1,
  gap: 4,
  className: '',
})

const classes = computed(() =>
  ['strand-grid', props.className].filter(Boolean).join(' '),
)

const inlineStyle = computed(() => ({
  gridTemplateColumns:
    props.minColWidth != null
      ? `repeat(auto-fit, minmax(${props.minColWidth}px, 1fr))`
      : `repeat(${props.columns}, 1fr)`,
  gap: `var(--strand-space-${props.gap})`,
}))
</script>

<template>
  <div :class="classes" :style="inlineStyle" v-bind="$attrs">
    <slot />
  </div>
</template>
