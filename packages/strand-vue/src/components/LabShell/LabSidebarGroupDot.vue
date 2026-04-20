<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props { className?: string }
const props = withDefaults(defineProps<Props>(), { className: '' })
const classes = computed(() => ['strand-ref-shell__group-dot', props.className].filter(Boolean).join(' '))
</script>
<template><span :class="classes" v-bind="$attrs" /></template>
