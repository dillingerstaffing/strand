<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Flexbox layout container for arranging children with consistent spacing.

  @example
  ```vue
  <script setup>
  import { Stack, Button } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Stack direction="horizontal" :gap="4" align="center">
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </Stack>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Flex direction */
  direction?: 'vertical' | 'horizontal'
  /** Gap between items, maps to --strand-space-{n} */
  gap?: number
  /** Cross-axis alignment */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Main-axis alignment */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  /** Enable flex-wrap */
  wrap?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  gap: 4,
  align: 'stretch',
  wrap: false,
  className: '',
})

const classes = computed(() =>
  [
    'strand-stack',
    `strand-stack--${props.direction}`,
    props.align !== 'stretch' && `strand-stack--align-${props.align}`,
    props.justify && `strand-stack--justify-${props.justify}`,
    props.wrap && 'strand-stack--wrap',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

const inlineStyle = computed(() => ({
  gap: `var(--strand-space-${props.gap})`,
}))
</script>

<template>
  <div :class="classes" :style="inlineStyle" v-bind="$attrs">
    <slot />
  </div>
</template>
