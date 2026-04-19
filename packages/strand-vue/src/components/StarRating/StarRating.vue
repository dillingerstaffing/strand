<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Interactive 1-to-5 star rating control. Mirrors the Preact and Svelte
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
  value: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  ariaLabel: string
}

const props = withDefaults(defineProps<StarRatingProps>(), {
  size: 'md',
  readOnly: false,
})

const hover = ref(0)

const classes = computed(() =>
  [
    'strand-star-rating',
    `strand-star-rating--${props.size}`,
    props.readOnly && 'strand-star-rating--readonly',
  ]
    .filter(Boolean)
    .join(' '),
)

const display = computed(() => hover.value || props.value)

function select(n: number): void {
  if (props.readOnly) return
  props.onChange?.(n)
}

function onKey(e: KeyboardEvent, n: number): void {
  if (props.readOnly) return
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    select(n)
  }
}
</script>

<template>
  <div
    :class="classes"
    role="radiogroup"
    :aria-label="ariaLabel"
    data-strand-component="star-rating"
    :data-value="String(value)"
  >
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      :class="`strand-star-rating__star${n <= display ? ' strand-star-rating__star--active' : ''}`"
      role="radio"
      :aria-checked="n === value ? 'true' : 'false'"
      :aria-label="`${n} star${n > 1 ? 's' : ''}`"
      :tabindex="readOnly ? -1 : 0"
      :disabled="readOnly"
      :data-star-value="String(n)"
      @click="select(n)"
      @keydown="(e: KeyboardEvent) => onKey(e, n)"
      @mouseenter="!readOnly && (hover = n)"
      @mouseleave="!readOnly && (hover = 0)"
      @focus="!readOnly && (hover = n)"
      @blur="!readOnly && (hover = 0)"
    >
      <span class="strand-star-rating__glyph" aria-hidden="true">{{ "\u2605" }}</span>
    </button>
  </div>
</template>
