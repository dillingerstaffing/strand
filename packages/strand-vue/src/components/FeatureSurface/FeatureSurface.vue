<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  The second dark surface role (design-language.md 9.3): a single element
  promoted above the content around it.

  Not InstrumentViewport, and the difference is not a shade. That one is
  the abyss and exists for DENSITY; this is midnight and exists for
  EMPHASIS. THE CASCADE IS THE PRIMITIVE: gray-400 (6.99 -> 4.36) and
  teal-vital (7.07 -> 4.42) both fail as text on midnight while passing
  on the abyss, and the instrument cascade uses both. Put ordinary text
  primitives inside this and they retint themselves.

  A view with several feature surfaces has no feature.
-->
<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  /** Render as a different element, e.g. "article" or "section". */
  as?: 'div' | 'article' | 'section'
  /**
   * Inner padding. The same ladder Card ships. `none` also clips to the
   * surface's radius, so panes laid against the corners cannot square them
   * off — use it when the CHILDREN carry the inset, e.g. a two-pane card
   * whose divider runs the full height.
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  padding: 'md',
  className: '',
})
defineOptions({ inheritAttrs: false })
const classes = computed(() =>
  [
    'strand-feature-surface',
    `strand-feature-surface--pad-${props.padding}`,
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <component :is="as" :class="classes" v-bind="$attrs"><slot /></component>
</template>
