<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  pinned?: boolean
  className?: string
}
const props = withDefaults(defineProps<Props>(), { pinned: false, className: '' })

const classes = computed(() =>
  ['strand-ref-tip', props.pinned ? 'strand-ref-tip--pinned' : '', props.className]
    .filter(Boolean)
    .join(' '),
)
</script>

<template><span :class="classes" v-bind="$attrs"><slot /></span></template>
