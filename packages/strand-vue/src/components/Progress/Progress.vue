<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Visual variant */
  variant?: 'bar' | 'ring'
  /** Completion percentage (0-100). Omit for indeterminate. */
  value?: number
  /** Size of the progress indicator */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'bar',
  size: 'md',
  className: '',
})

const RING_SIZES: Record<string, number> = { sm: 24, md: 40, lg: 56 }
const RING_STROKE = 3

const isDeterminate = computed(() => props.value != null)

const classes = computed(() =>
  [
    'strand-progress',
    `strand-progress--${props.variant}`,
    `strand-progress--${props.size}`,
    !isDeterminate.value && 'strand-progress--indeterminate',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

const dim = computed(() => RING_SIZES[props.size] ?? RING_SIZES.md)
const radius = computed(() => (dim.value - RING_STROKE) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() =>
  isDeterminate.value
    ? circumference.value - (circumference.value * (props.value as number)) / 100
    : 0,
)
</script>

<template>
  <div
    :class="classes"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="isDeterminate ? value : undefined"
    v-bind="$attrs"
  >
    <!-- Ring variant -->
    <template v-if="variant === 'ring'">
      <svg
        :width="dim"
        :height="dim"
        :viewBox="`0 0 ${dim} ${dim}`"
        class="strand-progress__ring"
      >
        <circle
          :cx="dim / 2"
          :cy="dim / 2"
          :r="radius"
          fill="none"
          :stroke-width="RING_STROKE"
          class="strand-progress__track"
        />
        <circle
          :cx="dim / 2"
          :cy="dim / 2"
          :r="radius"
          fill="none"
          :stroke-width="RING_STROKE"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="isDeterminate ? offset : undefined"
          stroke-linecap="round"
          class="strand-progress__fill"
          :transform="`rotate(-90 ${dim / 2} ${dim / 2})`"
        />
      </svg>
    </template>
    <!-- Bar variant -->
    <template v-else>
      <div
        class="strand-progress__fill"
        :style="isDeterminate ? { width: `${value}%` } : undefined"
      />
    </template>
  </div>
</template>
