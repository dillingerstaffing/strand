<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Card-metadata key-value row. Editorial sibling of the default
  instrument strand-kv readout. Use inside CardSection bodies to
  produce soft sans-serif Blue-midnight values separated by a
  dashed divider.
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Label column content (mono, uppercase, left) */
  label: string
  /** Value column content (sans, blue-midnight, right) */
  value: string
  /** When true, applies --status color (teal-vital) to the value */
  status?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: false,
  className: '',
})

const classes = computed(() =>
  [
    'strand-kv',
    'strand-kv--editorial',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

const valueClasses = computed(() =>
  [
    'strand-kv__value',
    props.status ? 'strand-kv__value--status' : '',
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <span class="strand-kv__label">
      <slot name="label">{{ label }}</slot>
    </span>
    <span :class="valueClasses">
      <slot name="value">{{ value }}</slot>
    </span>
  </div>
</template>
