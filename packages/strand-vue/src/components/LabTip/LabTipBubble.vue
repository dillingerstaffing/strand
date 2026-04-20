<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

type Placement = 'top' | 'bottom' | 'left' | 'right'
interface Props {
  placement?: Placement
  className?: string
}
const props = withDefaults(defineProps<Props>(), { placement: 'top', className: '' })

const classes = computed(() =>
  ['strand-ref-tip__bubble', `strand-ref-tip__bubble--${props.placement}`, props.className]
    .filter(Boolean)
    .join(' '),
)
</script>

<template><span :class="classes" role="tooltip" v-bind="$attrs"><slot /></span></template>
