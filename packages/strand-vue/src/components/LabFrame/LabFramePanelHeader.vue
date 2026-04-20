<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props { className?: string }
const props = withDefaults(defineProps<Props>(), { className: '' })
const classes = computed(() => ['strand-ref-frame__panel-header', props.className].filter(Boolean).join(' '))
</script>
<template><div :class="classes" v-bind="$attrs"><slot /></div></template>
