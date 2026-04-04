<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Show grid overlay lines */
  grid?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  grid: false,
  className: '',
})

const classes = computed(() =>
  [
    'strand-instrument-viewport',
    props.grid && 'strand-instrument-viewport--grid',
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
