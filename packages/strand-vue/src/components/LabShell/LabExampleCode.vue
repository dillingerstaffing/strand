<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props { className?: string }
const props = withDefaults(defineProps<Props>(), { className: '' })
const classes = computed(() => ['strand-ref-example__code', props.className].filter(Boolean).join(' '))
</script>
<template><span :class="classes" v-bind="$attrs"><slot /></span></template>
