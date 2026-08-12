<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  The card the whole application sits inside.

  NOT a content width: Container's tiers are reading measures, widest 1024
  because text stops being readable past it. A frame is bounded by how wide
  an application should feel. Use Container INSIDE this, not instead of it.

  Clipping is the point rather than the width: without it a nav's square
  corners overhang the frame's rounded ones.
-->
<script setup lang="ts">
import { computed } from 'vue'
interface Props { className?: string }
const props = withDefaults(defineProps<Props>(), { className: '' })
defineOptions({ inheritAttrs: false })
const classes = computed(() => ['strand-app-shell', props.className].filter(Boolean).join(' '))
</script>
<template>
  <div :class="classes" v-bind="$attrs"><slot /></div>
</template>
