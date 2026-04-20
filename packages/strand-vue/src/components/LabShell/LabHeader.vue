<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props { className?: string }
const props = withDefaults(defineProps<Props>(), { className: '' })
const classes = computed(() => ['strand-ref-header', props.className].filter(Boolean).join(' '))
</script>
<template><header :class="classes" v-bind="$attrs"><slot /></header></template>
