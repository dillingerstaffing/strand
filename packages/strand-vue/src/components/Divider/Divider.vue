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
  /** Separator direction */
  direction?: 'horizontal' | 'vertical'
  /** Optional label text displayed in the middle of the line */
  label?: string
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  className: '',
})

const isVertical = computed(() => props.direction === 'vertical')
const isLabeled = computed(() => !isVertical.value && !!props.label)
const isPlainHorizontal = computed(() => !isVertical.value && !props.label)

const classes = computed(() => {
  if (isVertical.value) {
    return ['strand-divider', 'strand-divider--vertical', props.className]
      .filter(Boolean)
      .join(' ')
  }
  if (isLabeled.value) {
    return ['strand-divider', 'strand-divider--horizontal', 'strand-divider--labeled', props.className]
      .filter(Boolean)
      .join(' ')
  }
  return ['strand-divider', 'strand-divider--horizontal', props.className]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <div
    v-if="isVertical"
    :class="classes"
    role="separator"
    aria-orientation="vertical"
  />
  <div
    v-else-if="isLabeled"
    :class="classes"
    role="separator"
    aria-orientation="horizontal"
  >
    <span class="strand-divider__line" />
    <span class="strand-divider__label">{{ label }}</span>
    <span class="strand-divider__line" />
  </div>
  <hr
    v-else
    :class="classes"
    role="separator"
    aria-orientation="horizontal"
  />
</template>
