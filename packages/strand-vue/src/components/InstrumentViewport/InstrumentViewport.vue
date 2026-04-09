<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Recessed dark surface for displaying instrument-style UI components.

  @example
  ```vue
  <script setup>
  import { InstrumentViewport, DataReadout } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <InstrumentViewport grid>
      <DataReadout label="Uptime" value="99.9%" />
    </InstrumentViewport>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Show grid overlay lines */
  grid?: boolean
  /** Render as page-filling instrument cabinet (DL Part 9.3 full-bleed mode).
   *  Requires the host page to apply `strand-body--instrument` to <body>
   *  so the dark surface reaches the screen edge. */
  fullBleed?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  grid: false,
  fullBleed: false,
  className: '',
})

const classes = computed(() =>
  [
    'strand-instrument-viewport',
    props.grid && 'strand-instrument-viewport--grid',
    props.fullBleed && 'strand-instrument-viewport--full-bleed',
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
