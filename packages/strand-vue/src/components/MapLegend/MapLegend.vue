<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  The category key for an instrument viewport's map. The four sector
  colours are the only place the Blue Discipline is relaxed (9.3): here
  the colour is data rather than decoration. An item is a button when it
  filters and a plain row when it does not.
-->
<script setup lang="ts">
import { computed } from 'vue'

export interface MapLegendItem {
  category: 'tech' | 'health' | 'trades' | 'finance'
  label: string
  /** Present means the row filters, so it renders as a button. */
  selectable?: boolean
}

interface Props {
  title?: string
  items: MapLegendItem[]
  className?: string
}
const props = withDefaults(defineProps<Props>(), { title: 'Legend', className: '' })
defineOptions({ inheritAttrs: false })
const emit = defineEmits<{ select: [category: string] }>()
const classes = computed(() =>
  ['strand-map-legend', props.className].filter(Boolean).join(' '),
)
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <div class="strand-map-legend__title">{{ title }}</div>
    <component
      :is="item.selectable ? 'button' : 'div'"
      v-for="item in items"
      :key="item.category"
      class="strand-map-legend__item"
      :type="item.selectable ? 'button' : undefined"
      @click="item.selectable && emit('select', item.category)"
    >
      <span :class="`strand-map-legend__dot strand-map-legend__dot--${item.category}`" aria-hidden="true" />{{ item.label }}
    </component>
  </div>
</template>
