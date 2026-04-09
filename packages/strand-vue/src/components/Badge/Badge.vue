<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Small status indicator or notification count, displayed inline or overlaid on content.

  @example
  ```vue
  <script setup>
  import { Badge } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Badge variant="count" status="red" :count="5">
      <button>Notifications</button>
    </Badge>
    <Badge variant="dot" status="teal" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  /** Badge display mode */
  variant?: 'dot' | 'count'
  /** Color status */
  status?: 'default' | 'teal' | 'blue' | 'amber' | 'red'
  /** Number to display (count variant only) */
  count?: number
  /** Maximum count before showing "N+" */
  maxCount?: number
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'count',
  status: 'default',
  maxCount: 99,
  className: '',
})

const slots = useSlots()

const hasChildren = computed(() => !!slots.default)

const displayValue = computed(() => {
  if (props.variant === 'count') {
    return props.count != null && props.count > props.maxCount
      ? `${props.maxCount}+`
      : props.count
  }
  return null
})

const ariaLabel = computed(() => {
  if (props.variant === 'dot') return 'Status indicator'
  if (props.count != null) return `${props.count} notifications`
  return undefined
})

const badgeClasses = computed(() =>
  [
    'strand-badge__indicator',
    `strand-badge--${props.variant}`,
    `strand-badge--${props.status}`,
  ]
    .filter(Boolean)
    .join(' '),
)

const wrapperClasses = computed(() =>
  hasChildren.value
    ? ['strand-badge', props.className].filter(Boolean).join(' ')
    : ['strand-badge', 'strand-badge--inline', props.className].filter(Boolean).join(' '),
)
</script>

<template>
  <span :class="wrapperClasses" v-bind="$attrs">
    <slot />
    <span :class="badgeClasses" :aria-label="ariaLabel" role="status">{{ displayValue }}</span>
  </span>
</template>
