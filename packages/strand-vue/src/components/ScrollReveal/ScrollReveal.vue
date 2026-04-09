<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Intersection Observer wrapper that reveals children with a transition on scroll.

  @example
  ```vue
  <script setup>
  import { ScrollReveal } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <ScrollReveal :threshold="0.2" once>
      <p>This content fades in on scroll.</p>
    </ScrollReveal>
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  /** Intersection threshold (0-1) to trigger reveal */
  threshold?: number
  /** Only reveal once (do not hide on exit) */
  once?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 0.1,
  once: true,
  className: '',
})

const elRef = ref<HTMLDivElement | null>(null)
const visible = ref(false)
let observer: IntersectionObserver | null = null

const classes = computed(() =>
  [
    'strand-reveal',
    visible.value && 'strand-reveal--visible',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

onMounted(() => {
  if (!elRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.value = true
          if (props.once && observer && elRef.value) {
            observer.unobserve(elRef.value)
          }
        } else if (!props.once) {
          visible.value = false
        }
      }
    },
    { threshold: props.threshold },
  )

  observer.observe(elRef.value)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div ref="elRef" :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>
