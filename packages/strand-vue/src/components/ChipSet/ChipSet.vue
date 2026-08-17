<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!-- Selectable chips that WRAP in a rail and SCROLL on a narrow viewport.
     multi renders aria-pressed toggles, single renders a radiogroup:
     "any of these" and "one of these" are different promises and painting
     them identically tells a screen reader nothing. It scrolls rather than
     clipping, because a filter the reader cannot reach is not a filter. -->
<script setup lang="ts">
import { computed } from 'vue'
export interface ChipSetItem { id: string; label: string }
interface Props {
  items: ChipSetItem[]
  selected?: string[]
  mode?: 'multi' | 'single'
  overflow?: 'wrap' | 'scroll'
  /** Chip size. `sm` is a denser strip; `md` is unchanged. */
  size?: 'sm' | 'md'
  label: string
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  selected: () => [], mode: 'multi', overflow: 'wrap', size: 'md', className: '',
})
defineOptions({ inheritAttrs: false })
const emit = defineEmits<{ selectionChange: [selected: string[]] }>()
const classes = computed(() =>
  [
    'strand-chip-set',
    props.overflow === 'scroll' ? 'strand-chip-set--scroll' : '',
    props.size === 'sm' ? 'strand-chip-set--sm' : '',
    // Composes the scroll-row contract rather than restating it.
    props.overflow === 'scroll' ? 'strand-scroll-row' : '',
    props.className,
  ].filter(Boolean).join(' '),
)
function toggle(id: string) {
  if (props.mode === 'single') { emit('selectionChange', [id]); return }
  emit('selectionChange',
    props.selected.includes(id) ? props.selected.filter((s) => s !== id) : [...props.selected, id])
}
</script>
<template>
  <div :class="classes" :role="mode === 'single' ? 'radiogroup' : 'group'" :aria-label="label" v-bind="$attrs">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="strand-chip-set__chip"
      :role="mode === 'single' ? 'radio' : undefined"
      :aria-pressed="mode === 'multi' ? selected.includes(item.id) : undefined"
      :aria-checked="mode === 'single' ? selected.includes(item.id) : undefined"
      @click="toggle(item.id)"
    >{{ item.label }}</button>
  </div>
</template>
