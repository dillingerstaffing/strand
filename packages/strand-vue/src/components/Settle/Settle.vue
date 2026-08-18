<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Fades a region's new state in when the model changes, instead of cutting
  to it.

  Implements design-language.md 6.9 (state change) and 6.9.1 (identity is
  what triggers it). Thin wrapper over the `.strand-settle` class.

  The sibling of Reserve, and the split is deliberate: Reserve holds the BOX
  while a wait resolves, Settle acknowledges the MOMENT the user's action
  took effect. It cannot affect layout, by design. If the two states are
  different sizes that is a space-contract problem (6.6.1) and belongs to
  Reserve.

  `on` is what makes a VALUE change animate. A count going from 6 to 7
  patches a text node and inserts nothing, so without an identity the fade
  never fires. The `:key` binding forces Vue to replace the element rather
  than patch it, which is exactly what the CSS needs.

  @example
  ```vue
  <script setup>
  import { Settle } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Settle as="span" :on="count">{{ count }} people</Settle>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** The value this region is showing. */
  on?: string | number | boolean | null
  /** Element to render. Defaults to a div; use span inline. */
  as?: string
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  className: '',
})

const classes = computed(() =>
  ['strand-settle', props.className].filter(Boolean).join(' '),
)

// undefined and null both mean "no forced identity", which is the insertion-only case: the element is new anyway, so there is nothing to force.
const identity = computed(() =>
  props.on === undefined || props.on === null ? undefined : String(props.on),
)
</script>

<template>
  <component :is="as" :key="identity" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
