<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!-- Selectable chips that WRAP in a rail and SCROLL on a narrow viewport.
     multi renders aria-pressed toggles, single renders a radiogroup:
     "any of these" and "one of these" are different promises and painting
     them identically tells a screen reader nothing. It scrolls rather than
     clipping, because a filter the reader cannot reach is not a filter. -->
<script setup lang="ts">
import { computed, ref } from 'vue'

export interface ChipSetItem {
  /** Stable identity, reported by `selectionChange`. */
  id: string
  label: string
}

interface Props {
  items: ChipSetItem[]
  /** ids currently selected. */
  selected?: string[]
  /** `multi` renders toggle buttons; `single` renders a radiogroup. */
  mode?: 'multi' | 'single'
  /** `scroll` never wraps and scrolls sideways. */
  overflow?: 'wrap' | 'scroll'
  size?: 'sm' | 'md'
  /** Accessible name for the set. */
  label: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  selected: () => [],
  mode: 'multi',
  overflow: 'wrap',
  size: 'md',
  className: '',
})
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{ selectionChange: [selected: string[]] }>()

const chips = ref<HTMLButtonElement[]>([])
const single = computed(() => props.mode === 'single')
const classes = computed(() =>
  [
    'strand-chip-set',
    props.overflow === 'scroll' && 'strand-chip-set--scroll',
    props.size === 'sm' && 'strand-chip-set--sm',
    props.overflow === 'scroll' && 'strand-scroll-row',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
const focused = computed(() => (single.value ? (props.items.find((i) => props.selected.includes(i.id)) ?? props.items[0])?.id : undefined))

function toggle(id: string) {
  if (single.value) {
    emit('selectionChange', [id])
    return
  }
  emit('selectionChange', props.selected.includes(id) ? props.selected.filter((s) => s !== id) : [...props.selected, id])
}
function onKeyDown(e: KeyboardEvent) {
  if (!single.value || props.items.length === 0) return
  const current = Math.max(0, props.items.findIndex((i) => i.id === focused.value))
  const n = props.items.length
  const next: Record<string, number> = { ArrowRight: (current + 1) % n, ArrowLeft: (current - 1 + n) % n, Home: 0, End: n - 1 }
  if (!(e.key in next)) return
  e.preventDefault()
  const id = props.items[next[e.key]].id
  emit('selectionChange', [id])
  chips.value.find((el) => el.dataset.chipId === id)?.focus()
}
</script>

<template>
  <div :class="classes" :role="single ? 'radiogroup' : 'group'" :aria-label="label" v-bind="$attrs" @keydown="onKeyDown">
    <button
      v-for="item in items"
      :key="item.id"
      ref="chips"
      type="button"
      class="strand-chip-set__chip"
      :data-chip-id="item.id"
      :role="single ? 'radio' : undefined"
      :aria-pressed="single ? undefined : selected.includes(item.id)"
      :aria-checked="single ? selected.includes(item.id) : undefined"
      :tabindex="single ? (item.id === focused ? 0 : -1) : undefined"
      @click="toggle(item.id)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
