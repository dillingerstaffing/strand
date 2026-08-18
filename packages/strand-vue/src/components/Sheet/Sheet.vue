<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Bottom-anchored modal: the pattern DL 11.6 names and 14.8 requires.

  Composes Dialog, so focus trapping, focus restoration, scroll lock and
  Escape dismissal are inherited rather than reimplemented here. What this
  adds is the anatomy the pattern owns: a head that does not scroll, a body
  that does, a foot holding the committing control in the thumb's reach, and
  a grabber that both states and implements drag-to-dismiss.

  WHY THE DRAG LIVES HERE AND NOT IN THE CONSUMER. The gesture has one
  non-obvious requirement and every hand-rolled version gets it wrong the same
  way: dismissing means dragging DOWN and away from a 28px strip, so without
  `setPointerCapture` the moves stop arriving almost immediately and the sheet
  springs back as though the gesture had been abandoned.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Sheet, Button } from '@dillingerstaffing/strand-vue';
  const open = ref(false);
  </script>

  <template>
    <Sheet :open="open" label="Filters" @close="open = false">
      <FilterControls />
      <template #action>
        <Button variant="primary" @click="open = false">Show 6 events</Button>
      </template>
    </Sheet>
  </template>
  ```
-->
<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from '../Dialog/Dialog.vue'

export interface SheetProps {
  /** Whether the sheet is open */
  open?: boolean
  /** Accessible name. A sheet has no visible heading, so this is the only one. */
  label?: string
  /** Whether the sheet can be dragged away. */
  draggable?: boolean
}

const props = withDefaults(defineProps<SheetProps>(), {
  open: false,
  label: '',
  draggable: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

/** Past this fraction of the sheet's OWN height, a drag closes it. */
const DISMISS_FRACTION = 0.28

const drag = ref(0)
const startY = ref<number | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)

function handlePointerDown(e: PointerEvent) {
  // A press with no usable coordinate starts no drag.
  if (!Number.isFinite(e.clientY)) return
  startY.value = e.clientY
  // The grabber captures the pointer (cf: sheet-pointer-capture).
  ;(e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId)
}

function handlePointerMove(e: PointerEvent) {
  if (startY.value === null) return
  // Downward only.
  drag.value = Math.max(0, e.clientY - startY.value)
}

function handlePointerUp(e: PointerEvent) {
  if (startY.value === null) return
  ;(e.currentTarget as HTMLElement | null)?.releasePointerCapture?.(e.pointerId)
  const height = panelRef.value?.getBoundingClientRect().height || 1
  const travelled = Math.max(0, e.clientY - startY.value)
  startY.value = null
  drag.value = 0
  // A fraction of the sheet's OWN height, so the same gesture means the same thing on a short phone and a tall one.
  if (travelled > height * DISMISS_FRACTION) emit('close')
}

// A cancelled pointer never dismisses (cf: sheet-pointer-capture).
function handlePointerCancel() {
  startY.value = null
  drag.value = 0
}

watch(
  () => props.open,
  (isOpen) => {
    // Reopening must not resume a half-finished drag from last time.
    if (isOpen) drag.value = 0
  },
)
</script>

<template>
  <Dialog
    :open="open"
    align="end"
    padding="none"
    :dismissible="false"
    :aria-label="label"
    @close="emit('close')"
  >
    <div
      ref="panelRef"
      class="strand-sheet__panel"
      :style="drag ? `transform: translateY(${drag}px)` : undefined"
    >
      <div
        v-if="draggable"
        class="strand-sheet__grab"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
      >
        <span class="strand-sheet__grabber" aria-hidden="true" />
      </div>

      <div v-if="$slots.head" class="strand-sheet__head">
        <slot name="head" />
      </div>

      <div class="strand-sheet__body">
        <slot />
      </div>

      <div v-if="$slots.action" class="strand-sheet__foot">
        <slot name="action" />
      </div>
    </div>
  </Dialog>
</template>
