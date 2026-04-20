<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  A horizontal row inside a composed card, separated from siblings
  by a hairline rule. Use multiple CardSection children inside a
  Card with padding="none" to stack header / body / cta rows. The
  first child's top rule is suppressed automatically.

  Distinct from the standalone strand-card-section molecule
  (DL 11.10 section-boundary production), which is a same-named
  block used outside cards.
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** When true, applies the --header layout (baseline, space-between, gap) */
  header?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  header: false,
  className: '',
})

const classes = computed(() =>
  [
    'strand-card__section',
    props.header ? 'strand-card__section--header' : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>
