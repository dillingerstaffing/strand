<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!-- An initials avatar beside a name, in a pill. One primitive rather than
     Avatar + Tag composed by hand, because the pill has to align the
     circle's optical centre with the name's baseline box and a consumer
     composing two primitives gets that right only by accident.
     The circle is aria-hidden: the name is the accessible name, and
     announcing "MK, Maria Klein" reads the same person twice. -->
<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  name: string
  initials?: string
  /** Makes the chip a button. */
  selectable?: boolean
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  initials: undefined, selectable: false, className: '',
})
defineOptions({ inheritAttrs: false })
const emit = defineEmits<{ select: [] }>()
const initialsFrom = (n: string) => {
  const p = n.trim().split(/\s+/).filter(Boolean)
  if (!p.length) return ''
  return ((p[0][0] ?? '') + (p.length > 1 ? (p[p.length - 1][0] ?? '') : '')).toUpperCase()
}
const classes = computed(() =>
  ['strand-person-chip', props.selectable ? 'strand-person-chip--action' : '', props.className]
    .filter(Boolean).join(' '),
)
</script>
<template>
  <component
    :is="selectable ? 'button' : 'span'"
    :class="classes"
    :type="selectable ? 'button' : undefined"
    v-bind="$attrs"
    @click="selectable && emit('select')"
  >
    <span class="strand-person-chip__avatar" aria-hidden="true">{{ initials ?? initialsFrom(name) }}</span>
    <span class="strand-person-chip__name">{{ name }}</span>
  </component>
</template>
