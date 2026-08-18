<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  A bottom-anchored region carrying the primary action of a view, placed
  where a thumb rests.

  Implements design-language.md 14.8 (target position). 14.7 makes a target
  hittable; this makes it reachable. Thin wrapper over the
  `.strand-actiondock` classes.

  Use it for the ONE action a view exists to produce, and show it only while
  the in-flow control it stands in for is off screen. A dock competing with
  the real control is two live buttons for one action.

  Accessibility: the docked control usually duplicates one already in the
  accessibility tree, so give the copy `aria-hidden` and a `tabindex="-1"`
  control to avoid a duplicate announcement and tab stop. Reach is a thumb
  problem; a keyboard user gains nothing from the copy.

  @example
  ```vue
  <ActionDock :visible="!primaryControlOnScreen" aria-hidden="true">
    <Button variant="primary" :tabindex="-1" @click="rsvp">RSVP</Button>
  </ActionDock>
  ```
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch as watchEffect } from 'vue'

interface Props {
  /** Showing; ignored when `watch` is set. */
  visible?: boolean
  /** The in-flow control this dock stands in for; the dock shows itself while that control is off screen. */
  watch?: Element | null
  /** When to show while watching; only `"hidden"` today. */
  revealWhen?: 'hidden'
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  watch: null,
  revealWhen: 'hidden',
  className: '',
})

const self = ref<HTMLDivElement | null>(null)
const selfDriven = ref(false)
const inset = ref(0)
let stopObserving: (() => void) | null = null
let resize: ResizeObserver | null = null

/** Whether `el` is outside the viewport trimmed by `inset` px at the bottom (cf: actiondock-reveal). */
function observeOffScreen(el: Element, onChange: (offScreen: boolean) => void, insetPx = 0): () => void {
  if (typeof IntersectionObserver !== 'function') return () => {}
  const io = new IntersectionObserver(([entry]) => onChange(entry.intersectionRatio < 1), {
    rootMargin: `0px 0px -${Math.max(0, Math.round(insetPx))}px 0px`,
    threshold: [0, 1],
  })
  io.observe(el)
  return () => io.disconnect()
}

function observe() {
  stopObserving?.()
  stopObserving = null
  if (!props.watch || props.revealWhen !== 'hidden') return
  stopObserving = observeOffScreen(props.watch, (off) => { selfDriven.value = off }, inset.value)
}

onMounted(() => {
  if (self.value && typeof ResizeObserver === 'function') {
    resize = new ResizeObserver(() => {
      const h = self.value?.offsetHeight ?? 0
      if (Math.abs(inset.value - h) > 1) inset.value = h
    })
    resize.observe(self.value)
  }
  observe()
})
watchEffect(() => [props.watch, props.revealWhen, inset.value], observe)
onBeforeUnmount(() => {
  stopObserving?.()
  resize?.disconnect()
})

const showing = computed(() => (props.watch ? selfDriven.value : props.visible))
const classes = computed(() => ['strand-actiondock', props.className].filter(Boolean).join(' '))
</script>

<template>
  <div ref="self" :class="classes" :data-strand-actiondock="showing ? 'visible' : 'hidden'">
    <slot />
  </div>
</template>
