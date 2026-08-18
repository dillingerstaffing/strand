<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  A search input for page chrome: a header field on a wide viewport, a
  full-width bar on a narrow one.

  Renders its full geometry from first paint with no JavaScript, so it can
  be server-rendered into a header without moving the page when it
  hydrates (design-language.md 6.6.1, the space contract).

  NOT `.strand-search-bar`, which is the overlay that floats on an
  instrument viewport. Use that one on a map; use this one in a header, a
  filter rail, or any ordinary document flow.

  Pair the two presentations with strand-hide-below-md / strand-hide-from-md
  rather than choosing one by measuring the viewport in JS.

  @example
  ```vue
  <SearchField
    v-model="q"
    class="strand-hide-below-md"
    placeholder="Search trail runs, pottery, chess"
    @clear="q = ''"
  />
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** `field` is the fixed-width header presentation, `full` spans its container. */
  variant?: 'field' | 'full'
  /** Placeholder. Name real content: "Search trail runs, pottery, chess". */
  placeholder?: string
  /** Accessible name. */
  label?: string
  /** Current value. v-model works through this. */
  modelValue?: string
  /** Renders a clear control when the field is non-empty. */
  clearable?: boolean
  /** Additional CSS class, merged onto the wrapper. */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'field',
  placeholder: 'Search',
  label: 'Search',
  modelValue: undefined,
  clearable: false,
  className: '',
})

// Attributes are bound to the input, not the wrapper, so a consumer's id lands on the field once (cf: search-field).
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const classes = computed(() =>
  [
    'strand-search-field',
    props.variant === 'full' ? 'strand-search-field--full' : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

const showClear = computed(
  () => props.clearable && typeof props.modelValue === 'string',
)
const hasValue = computed(
  () => typeof props.modelValue === 'string' && props.modelValue.length > 0,
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div :class="classes" role="search">
    <svg
      class="strand-search-field__icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </svg>

    <input
      class="strand-search-field__input"
      type="search"
      :aria-label="label"
      :placeholder="placeholder"
      :value="modelValue"
      v-bind="$attrs"
      @input="onInput"
    />

    <button
      v-if="showClear"
      type="button"
      class="strand-search-field__clear"
      aria-label="Clear search"
      :hidden="!hasValue"
      @click="emit('clear')"
    >
      <svg
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
  </div>
</template>
