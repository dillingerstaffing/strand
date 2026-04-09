<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Hover/focus-triggered text popup anchored to a trigger element.

  @example
  ```vue
  <script setup>
  import { Tooltip, Button } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Tooltip content="Save your progress" position="top">
      <Button variant="primary">Save</Button>
    </Tooltip>
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'

export interface TooltipProps {
  /** Tooltip text */
  content: string
  /** Position relative to trigger */
  position?: 'top' | 'right' | 'bottom' | 'left'
  /** Delay in ms before showing */
  delay?: number
}

const props = withDefaults(defineProps<TooltipProps>(), {
  position: 'top',
  delay: 200,
})

let tooltipIdCounter = 0
const tooltipId = `strand-tooltip-${++tooltipIdCounter}`

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function show() {
  timer = setTimeout(() => {
    visible.value = true
  }, props.delay)
}

function hide() {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  visible.value = false
}

onUnmounted(() => {
  if (timer !== null) {
    clearTimeout(timer)
  }
})

const wrapperClasses = computed(() =>
  ['strand-tooltip__wrapper'].filter(Boolean).join(' '),
)

const tooltipClasses = computed(() =>
  [
    'strand-tooltip',
    `strand-tooltip--${props.position}`,
    visible.value && 'strand-tooltip--visible',
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <span
    :class="wrapperClasses"
    :aria-describedby="tooltipId"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
  >
    <slot />
    <span
      :id="tooltipId"
      :class="tooltipClasses"
      role="tooltip"
      :aria-hidden="!visible"
    >
      {{ content }}
    </span>
  </span>
</template>
