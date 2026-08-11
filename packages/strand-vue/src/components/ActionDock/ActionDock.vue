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
import { computed } from 'vue'

interface Props {
  /** Whether the dock is showing. Default false, so a dock that is never
      driven occludes nothing rather than welding itself across content. */
  visible?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  className: '',
})

const classes = computed(() =>
  ['strand-actiondock', props.className].filter(Boolean).join(' '),
)
</script>

<template>
  <div
    :class="classes"
    :data-strand-actiondock="visible ? 'visible' : 'hidden'"
  >
    <slot />
  </div>
</template>
