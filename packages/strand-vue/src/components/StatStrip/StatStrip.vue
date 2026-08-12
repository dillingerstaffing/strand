<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!-- A row of labelled value cells, compared across rather than read singly.
     Not DataReadout, which renders one pair as a unit. Renders as a <dl>
     because that is what it is: a row of divs would give a screen reader
     six unrelated strings instead of three pairs. -->
<script setup lang="ts">
import { computed } from 'vue'
export interface StatStripItem { label: string; value: string }
interface Props {
  items: StatStripItem[]
  variant?: 'plain' | 'bordered'
  className?: string
}
const props = withDefaults(defineProps<Props>(), { variant: 'plain', className: '' })
defineOptions({ inheritAttrs: false })
const classes = computed(() =>
  ['strand-stat-strip', props.variant === 'bordered' ? 'strand-stat-strip--bordered' : '', props.className]
    .filter(Boolean).join(' '),
)
</script>
<template>
  <dl :class="classes" v-bind="$attrs">
    <div v-for="item in items" :key="item.label" class="strand-stat-strip__cell">
      <dt class="strand-stat-strip__label">{{ item.label }}</dt>
      <dd class="strand-stat-strip__value">{{ item.value }}</dd>
    </div>
  </dl>
</template>
