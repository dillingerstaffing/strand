<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Contained surface for grouping related content with elevation and padding options.

  @example
  ```vue
  <script setup>
  import { Card } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Card variant="elevated" padding="lg">
      <h3>Card Title</h3>
      <p>Card content goes here.</p>
    </Card>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Visual style variant */
  variant?: 'elevated' | 'outlined' | 'interactive'
  /** Inner padding */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  padding: 'md',
  className: '',
})

const classes = computed(() =>
  [
    'strand-card',
    `strand-card--${props.variant}`,
    `strand-card--pad-${props.padding}`,
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>
