<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  /** Image URL */
  src?: string
  /** Alt text for image */
  alt?: string
  /** Fallback initials (1-2 characters) */
  initials?: string
  /** Avatar size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  initials: '',
  size: 'md',
  className: '',
})

const imgError = ref(false)

const handleError = () => {
  imgError.value = true
}

const showImage = computed(() => props.src && !imgError.value)
const displayInitials = computed(() => props.initials.slice(0, 2).toUpperCase())

const classes = computed(() =>
  [
    'strand-avatar',
    `strand-avatar--${props.size}`,
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" role="img" :aria-label="alt || displayInitials" v-bind="$attrs">
    <img
      v-if="showImage"
      class="strand-avatar__img"
      :src="src"
      :alt="alt"
      @error="handleError"
    />
    <span v-else class="strand-avatar__initials" aria-hidden="true">{{ displayInitials }}</span>
  </div>
</template>
