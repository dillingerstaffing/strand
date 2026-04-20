<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props { href?: string; className?: string }
const props = withDefaults(defineProps<Props>(), { href: '#', className: '' })
const classes = computed(() => ['strand-ref-shell__group-link', props.className].filter(Boolean).join(' '))
</script>

<template>
  <a :class="classes" :href="props.href" v-bind="$attrs">
    <span class="strand-ref-shell__group-dot"></span>
    <slot />
  </a>
</template>
