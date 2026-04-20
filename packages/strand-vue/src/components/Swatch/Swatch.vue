<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  hex: string
  background: string
  color: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), { className: '' })

const classes = computed(() => ['strand-swatch', props.className].filter(Boolean).join(' '))
const swatchStyle = computed(() => ({ background: props.background, color: props.color }))
</script>

<template>
  <div :class="classes" :style="swatchStyle" v-bind="$attrs">
    <span class="strand-swatch__name">{{ name }}</span>
    <span class="strand-swatch__hex">{{ hex }}</span>
  </div>
</template>
