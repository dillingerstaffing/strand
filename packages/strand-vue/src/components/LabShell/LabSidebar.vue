<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props { className?: string }
const props = withDefaults(defineProps<Props>(), { className: '' })
const classes = computed(() => ['strand-ref-shell__sidebar', props.className].filter(Boolean).join(' '))
</script>
<template><aside :class="classes" v-bind="$attrs"><slot /></aside></template>
