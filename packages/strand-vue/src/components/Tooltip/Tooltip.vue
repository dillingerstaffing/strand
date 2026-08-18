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
import { type VNode, cloneVNode, computed, onUnmounted, ref, useId, useSlots, watch } from 'vue'

export interface TooltipProps {
  /** Tooltip text */
  content: string
  /** Position relative to trigger */
  position?: 'top' | 'right' | 'bottom' | 'left'
  /** Delay in ms before showing */
  delay?: number
  /** Controlled visibility */
  open?: boolean
  /** Visibility to start with when uncontrolled */
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<TooltipProps>(), {
  position: 'top',
  delay: 200,
  open: undefined,
  defaultOpen: false,
})

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'openChange', open: boolean): void
}>()

const slots = useSlots()
const tooltipId = useId()
const ownOpen = ref(props.defaultOpen)
const isOpen = computed(() => props.open ?? ownOpen.value)
let timer: ReturnType<typeof setTimeout> | null = null

function setOwn(next: boolean) {
  if (ownOpen.value === next) return
  ownOpen.value = next
  emit('update:open', next)
  emit('openChange', next)
}

function show() {
  if (timer !== null) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    setOwn(true)
  }, props.delay)
}

function hide() {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  setOwn(false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) hide()
}

onUnmounted(() => {
  if (timer !== null) clearTimeout(timer)
})

/** A single slotted element receives aria-describedby; anything else is described through the wrapper. */
const Trigger = () => {
  const nodes = (slots.default?.() ?? []) as VNode[]
  if (nodes.length === 1 && typeof nodes[0].type !== 'symbol') return [cloneVNode(nodes[0], { 'aria-describedby': tooltipId })]
  return nodes
}
const singleTrigger = computed(() => {
  const nodes = (slots.default?.() ?? []) as VNode[]
  return nodes.length === 1 && typeof nodes[0].type !== 'symbol'
})

const tooltipClasses = computed(() =>
  ['strand-tooltip', `strand-tooltip--${props.position}`, isOpen.value && 'strand-tooltip--visible']
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <span
    class="strand-tooltip__wrapper"
    :aria-describedby="singleTrigger ? undefined : tooltipId"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown="onKeydown"
  >
    <Trigger />
    <span :id="tooltipId" :class="tooltipClasses" role="tooltip" :aria-hidden="!isOpen">
      {{ content }}
    </span>
  </span>
</template>
