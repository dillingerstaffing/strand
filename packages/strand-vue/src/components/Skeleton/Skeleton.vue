<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Placeholder shimmer shape used while content is loading.

  @example
  ```vue
  <script setup>
  import { Skeleton } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="circle" width="48px" />
    <Skeleton variant="rectangle" width="100%" height="200px" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Shape variant */
  variant?: 'text' | 'rectangle' | 'circle'
  /** CSS width value */
  width?: string
  /** CSS height value */
  height?: string
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  className: '',
})

const effectiveWidth = computed(() =>
  props.width ?? (props.variant === 'text' ? '100%' : undefined),
)

const effectiveHeight = computed(() =>
  props.variant === 'circle' ? effectiveWidth.value : props.height,
)

const classes = computed(() =>
  [
    'strand-skeleton',
    `strand-skeleton--${props.variant}`,
    'strand-skeleton--shimmer',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

const inlineStyle = computed(() => ({
  width: effectiveWidth.value,
  height: effectiveHeight.value,
}))
</script>

<template>
  <div :class="classes" aria-hidden="true" :style="inlineStyle" v-bind="$attrs" />
</template>
