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
  variant?: 'elevated' | 'outlined' | 'flat' | 'warm' | 'interactive'
  /** Inner padding */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Hover lift and pointer, without changing the variant */
  interactive?: boolean
  /** Marks the card as the active item; paints no chrome of its own */
  active?: boolean
  /** Root element */
  as?: string
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  padding: 'md',
  interactive: false,
  active: false,
  as: 'div',
  className: '',
})

const classes = computed(() =>
  [
    'strand-card',
    props.variant !== 'elevated' && `strand-card--${props.variant}`,
    `strand-card--pad-${props.padding}`,
    props.interactive && props.variant !== 'interactive' && 'strand-card--interactive',
    props.active && 'strand-card--active',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <component :is="as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
