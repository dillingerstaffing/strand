<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** URL destination */
  href: string
  /** Opens in new tab with rel="noopener noreferrer" */
  external?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  external: false,
  className: '',
})

const classes = computed(() =>
  ['strand-link', props.className].filter(Boolean).join(' '),
)
</script>

<template>
  <a
    :href="href"
    :class="classes"
    v-bind="{
      ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      ...$attrs,
    }"
  >
    <slot />
  </a>
</template>
