<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Overline label text */
  label: string
  /** The large displayed value */
  value: string | number
  /** Size variant: sm (compact), md (default), lg (hero), xl (primary instrument) */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
})

const classes = computed(() =>
  [
    'strand-data-readout',
    props.size && props.size !== 'md' ? `strand-data-readout--${props.size}` : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <span class="strand-data-readout__label">{{ label }}</span>
    <span class="strand-data-readout__value">{{ value }}</span>
  </div>
</template>
