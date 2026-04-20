<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), { className: '' })

const classes = computed(() => ['strand-ref-frame__dot', props.className].filter(Boolean).join(' '))
const dotStyle = computed(() => (props.color ? { background: props.color } : {}))
</script>

<template><span :class="classes" :style="dotStyle" v-bind="$attrs" /></template>
