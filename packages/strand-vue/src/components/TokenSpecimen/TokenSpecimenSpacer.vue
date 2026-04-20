<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string | number
  className?: string
}
const props = withDefaults(defineProps<Props>(), { className: '' })

const classes = computed(() => ['strand-token-specimen__spacer', props.className].filter(Boolean).join(' '))
const barStyle = computed(() => {
  const w = typeof props.width === 'number' ? props.width + 'px' : props.width
  return w ? { width: w } : {}
})
</script>

<template>
  <span :class="classes" :style="barStyle" v-bind="$attrs" />
</template>
