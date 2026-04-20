<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hidden?: boolean
  className?: string
}
const props = withDefaults(defineProps<Props>(), { hidden: false, className: '' })

const classes = computed(() => ['strand-ref-frame__content', props.className].filter(Boolean).join(' '))
const ariaHidden = computed(() => (props.hidden ? 'true' : undefined))
</script>

<template>
  <div :class="classes" :aria-hidden="ariaHidden" v-bind="$attrs"><slot /></div>
</template>
