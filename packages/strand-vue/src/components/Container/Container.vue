<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Max-width constraint */
  size?: 'narrow' | 'default' | 'wide' | 'full'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  className: '',
})

const classes = computed(() =>
  [
    'strand-container',
    `strand-container--${props.size}`,
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
