<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Padding variant */
  variant?: 'standard' | 'hero'
  /** Surface background */
  background?: 'primary' | 'elevated' | 'recessed'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'standard',
  background: 'primary',
  className: '',
})

const classes = computed(() =>
  [
    'strand-section',
    `strand-section--${props.variant}`,
    `strand-section--bg-${props.background}`,
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <section :class="classes" v-bind="$attrs">
    <slot />
  </section>
</template>
