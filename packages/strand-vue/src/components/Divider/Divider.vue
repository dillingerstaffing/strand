<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Visual separator line between content sections, horizontal or vertical.

  @example
  ```vue
  <script setup>
  import { Divider } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Divider direction="horizontal" label="OR" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Separator direction. */
  direction?: 'horizontal' | 'vertical'
  /** `gradient` fades the line out at both ends. */
  variant?: 'line' | 'gradient'
  /** Text set into the middle of a horizontal line; the default slot takes markup. */
  label?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  variant: 'line',
  label: undefined,
  className: '',
})

const slots = defineSlots<{ default?: () => unknown }>()
const isVertical = computed(() => props.direction === 'vertical')
const isLabeled = computed(() => !isVertical.value && (!!props.label || !!slots.default))
const classes = computed(() =>
  [
    'strand-divider',
    `strand-divider--${props.direction}`,
    props.variant === 'gradient' && 'strand-divider--gradient',
    isLabeled.value && 'strand-divider--labeled',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div v-if="isVertical" :class="classes" role="separator" aria-orientation="vertical" v-bind="$attrs" />
  <div v-else-if="isLabeled" :class="classes" role="separator" aria-orientation="horizontal" v-bind="$attrs">
    <span class="strand-divider__line" />
    <span class="strand-divider__label"><slot>{{ label }}</slot></span>
    <span class="strand-divider__line" />
  </div>
  <hr v-else :class="classes" v-bind="$attrs" />
</template>
