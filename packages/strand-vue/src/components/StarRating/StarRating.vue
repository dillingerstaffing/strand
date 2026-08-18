<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Star rating control: each star is a radio; arrows, Home and End move the rating. Mirrors the Preact and Svelte
  StarRating APIs for cross-consumer parity.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { StarRating } from '@dillingerstaffing/strand-vue';
  const value = ref(0);
  </script>

  <template>
    <StarRating
      :value="value"
      :onChange="(v) => value = v"
      ariaLabel="Rate this event"
      size="md"
    />
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref } from 'vue'

export interface StarRatingProps {
  /** 0 through count; 0 is unset. */
  value: number
  /** Called with the new value, 1 through count, or 0 when allowClear re-selects the current star. */
  onChange?: (v: number) => void
  /** Number of stars. */
  count?: number
  /** Selecting the current star again clears the rating. */
  allowClear?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Renders as an image named "{value} of {count} stars"; no controls. */
  readOnly?: boolean
  /** Accessible name for the group. */
  ariaLabel: string
}

const props = withDefaults(defineProps<StarRatingProps>(), {
  count: 5,
  allowClear: false,
  size: 'md',
  readOnly: false,
})

const hover = ref(0)
const starEls = ref<HTMLButtonElement[]>([])

const classes = computed(() =>
  ['strand-star-rating', `strand-star-rating--${props.size}`, props.readOnly && 'strand-star-rating--readonly'].filter(Boolean).join(' '),
)
const display = computed(() => hover.value || props.value)
const focused = computed(() => props.value || 1)

function select(n: number): void {
  props.onChange?.(props.allowClear && n === props.value ? 0 : n)
}
function moveTo(n: number): void {
  const next = Math.min(props.count, Math.max(1, n))
  props.onChange?.(next)
  starEls.value.find((el) => Number(el.dataset.starValue) === next)?.focus()
}
function onKeyDown(e: KeyboardEvent): void {
  const v = props.value
  const next: Record<string, number> = { ArrowRight: v + 1, ArrowUp: v + 1, ArrowLeft: v - 1, ArrowDown: v - 1, Home: 1, End: props.count }
  if (!(e.key in next)) return
  e.preventDefault()
  moveTo(next[e.key])
}
</script>

<template>
  <div v-if="readOnly" :class="classes" role="img" :aria-label="`${ariaLabel}, ${value} of ${count} stars`" data-strand-component="star-rating" :data-value="String(value)">
    <span v-for="n in count" :key="n" :class="`strand-star-rating__star${n <= value ? ' strand-star-rating__star--active' : ''}`" :data-star-value="String(n)">
      <span class="strand-star-rating__glyph" aria-hidden="true">{{ "\u2605" }}</span>
    </span>
  </div>
  <div v-else :class="classes" role="radiogroup" :aria-label="ariaLabel" data-strand-component="star-rating" :data-value="String(value)" @keydown="onKeyDown">
    <button
      v-for="n in count"
      :key="n"
      ref="starEls"
      type="button"
      :class="`strand-star-rating__star${n <= display ? ' strand-star-rating__star--active' : ''}`"
      role="radio"
      :aria-checked="n === value ? 'true' : 'false'"
      :aria-label="`${n} star${n > 1 ? 's' : ''}`"
      :tabindex="n === focused ? 0 : -1"
      :data-star-value="String(n)"
      @click="select(n)"
      @mouseenter="hover = n"
      @mouseleave="hover = 0"
      @focus="hover = n"
      @blur="hover = 0"
    >
      <span class="strand-star-rating__glyph" aria-hidden="true">{{ "\u2605" }}</span>
    </button>
  </div>
</template>
