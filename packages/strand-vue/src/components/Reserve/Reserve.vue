<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  A region that holds its box while data loads, then cross-fades the
  placeholder to the content.

  Implements design-language.md 6.6.1 (the space contract) and 6.6.2
  (placeholder to content). Thin wrapper over the `.strand-reserve` classes.

  Sizing: if the placeholder already matches the shape of the content, the
  region sizes itself and you need no height at all. Supply `height` only
  when the placeholder is genuinely smaller than what replaces it.

  @example
  ```vue
  <script setup>
  import { Reserve, Skeleton } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Reserve :ready="!!event">
      <template #placeholder><Skeleton variant="rectangle" height="42px" /></template>
      <JoinLive :event="event" />
    </Reserve>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Whether the real content has arrived. Drives the cross-fade. */
  ready?: boolean
  /** The answer arrived and there is nothing to show. */
  empty?: boolean
  /** Reserved minimum height, base breakpoint. Any CSS length. */
  height?: string
  /** Reserved minimum height from 768px up. Falls back to `height`. */
  heightMd?: string
  /** Reserved minimum height from 1024px up. Falls back to `heightMd`. */
  heightLg?: string
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  ready: false,
  empty: false,
  className: '',
})

const classes = computed(() =>
  ['strand-reserve', props.className].filter(Boolean).join(' '),
)

const inlineStyle = computed(() => {
  const vars: Record<string, string> = {}
  if (props.height) vars['--strand-reserve-h'] = props.height
  if (props.heightMd) vars['--strand-reserve-h-md'] = props.heightMd
  if (props.heightLg) vars['--strand-reserve-h-lg'] = props.heightLg
  return vars
})
</script>

<template>
  <div
    :class="classes"
    :data-strand-reserve="empty ? 'empty' : ready ? 'ready' : 'pending'"
    :style="inlineStyle"
    v-bind="$attrs"
  >
    <div class="strand-reserve__placeholder" aria-hidden="true">
      <slot name="placeholder" />
    </div>
    <div class="strand-reserve__content">
      <slot />
    </div>
  </div>
</template>
