<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), { className: '' })

const classes = computed(() => ['strand-container-scale__bar', props.className].filter(Boolean).join(' '))
const barStyle = computed(() => (props.width ? { width: props.width } : {}))
</script>

<template>
  <div :class="classes" :style="barStyle" v-bind="$attrs"><slot /></div>
</template>
