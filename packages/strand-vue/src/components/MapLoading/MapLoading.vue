<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  The screen that covers an instrument viewport while it boots. Fades out
  rather than unmounting, so the map beneath is never revealed mid-paint:
  keep it mounted and flip `visible`. role="status" so the caption is
  announced rather than the state changing silently.
-->
<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  /** Default true: it covers a booting instrument, so present is the safe state. */
  visible?: boolean
  /** Instrument voice (11.7): "Processing", not "Loading...". */
  text?: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  visible: true,
  text: 'Processing',
  className: '',
})
defineOptions({ inheritAttrs: false })
const classes = computed(() =>
  [
    'strand-map-loading',
    props.visible ? '' : 'strand-map-loading--hidden',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div
    :class="classes"
    role="status"
    aria-live="polite"
    :aria-busy="visible ? 'true' : 'false'"
    v-bind="$attrs"
  >
    <div class="strand-map-loading__spinner" aria-hidden="true" />
    <div class="strand-map-loading__text">{{ text }}</div>
    <div class="strand-map-loading__bar" aria-hidden="true" />
  </div>
</template>
