<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  One result in an instrument's results panel. Renders as a <button> when
  selectable and an <article> when not: a card that pans a map when
  clicked is a control and owes the keyboard the same affordance as the
  mouse; a card that only displays is not, and a button role would
  promise otherwise. `active` pairs with aria-current so the highlighted
  result is announced rather than only tinted.
-->
<script setup lang="ts">
import { computed } from 'vue'
interface Badge { label: string; variant?: 'remote' | 'source' }
interface Props {
  title: string
  company?: string
  location?: string
  salary?: string
  badges?: Badge[]
  active?: boolean
  /** Makes the card a button. */
  selectable?: boolean
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  company: undefined, location: undefined, salary: undefined,
  badges: undefined, active: false, selectable: false, className: '',
})
defineOptions({ inheritAttrs: false })
const emit = defineEmits<{ select: [] }>()
const classes = computed(() =>
  ['strand-result-card', props.active ? 'strand-result-card--active' : '', props.className]
    .filter(Boolean).join(' '),
)
const badgeClass = (b: Badge) =>
  ['strand-result-card__badge', b.variant ? `strand-result-card__badge--${b.variant}` : '']
    .filter(Boolean).join(' ')
</script>

<template>
  <component
    :is="selectable ? 'button' : 'article'"
    :class="classes"
    :type="selectable ? 'button' : undefined"
    :aria-current="active ? 'true' : undefined"
    v-bind="$attrs"
    @click="selectable && emit('select')"
  >
    <div class="strand-result-card__title">{{ title }}</div>
    <div v-if="company" class="strand-result-card__company">{{ company }}</div>
    <div v-if="location || salary || badges?.length" class="strand-result-card__meta">
      <span v-if="location" class="strand-result-card__location">{{ location }}</span>
      <span v-if="salary" class="strand-result-card__salary">{{ salary }}</span>
      <span v-for="b in badges" :key="b.label" :class="badgeClass(b)">{{ b.label }}</span>
    </div>
  </component>
</template>
