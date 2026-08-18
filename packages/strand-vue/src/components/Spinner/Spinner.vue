<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Animated loading indicator with screen-reader-accessible status text.

  @example
  ```vue
  <script setup>
  import { Spinner } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Spinner size="lg" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  /** What is loading, read to assistive tech. */
  label?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  label: 'Loading',
  className: '',
})

const classes = computed(() => ['strand-spinner', `strand-spinner--${props.size}`, props.className].filter(Boolean).join(' '))
</script>

<template>
  <span :class="classes" role="status" v-bind="$attrs">
    <span class="strand-spinner__ring" aria-hidden="true" />
    <span class="strand-sr-only">{{ label }}</span>
  </span>
</template>
