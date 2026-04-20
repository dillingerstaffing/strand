<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  ariaLabel?: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Close',
  className: '',
})

const classes = computed(() => ['strand-ref-frame__panel-close', props.className].filter(Boolean).join(' '))
</script>

<template>
  <button
    type="button"
    :class="classes"
    :aria-label="props.ariaLabel"
    v-bind="$attrs"
  >
    <slot>×</slot>
  </button>
</template>
