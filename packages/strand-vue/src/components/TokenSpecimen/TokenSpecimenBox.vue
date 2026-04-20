<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  radius?: string
  shadow?: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), { className: '' })

const classes = computed(() => ['strand-token-specimen__box', props.className].filter(Boolean).join(' '))
const boxStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.radius) s.borderRadius = props.radius
  if (props.shadow) s.boxShadow = props.shadow
  return s
})
</script>

<template>
  <span :class="classes" :style="boxStyle" v-bind="$attrs" />
</template>
