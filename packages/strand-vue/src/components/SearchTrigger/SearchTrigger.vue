<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  A control that looks like a search field and behaves like a button: it
  opens a search overlay rather than accepting text.

  Use this wherever search is palette-driven. Use SearchField only where
  the input itself is the search.

  Accessibility: a <button> with aria-haspopup="dialog", so assistive
  technology announces that activating it opens something rather than
  promising that typing works here. An <input> that opened an overlay on
  focus would violate WCAG 3.2.1 (On Focus).

  @example
  ```vue
  <SearchTrigger
    class="strand-hide-below-md"
    label="Search trail runs, pottery, chess"
    :expanded="paletteOpen"
    controls="search-palette"
    @click="paletteOpen = true"
  />
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** `field` is the fixed-width header presentation, `full` spans its container, `icon` is a square touch-target button (cf: search-trigger). */
  variant?: 'field' | 'full' | 'icon'
  /** Visible standing text, which is ALSO the accessible name. */
  label?: string
  /** Whether the overlay this opens is currently showing. */
  expanded?: boolean
  /** `id` of the overlay, when one is rendered. */
  controls?: string
  /** Additional CSS class. */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'field',
  label: 'Search',
  expanded: undefined,
  controls: undefined,
  className: '',
})

const classes = computed(() =>
  [
    'strand-search-field',
    props.variant === 'full' ? 'strand-search-field--full' : '',
    'strand-search-trigger',
    props.variant === 'icon' ? 'strand-search-trigger--icon' : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <button
    type="button"
    :class="classes"
    aria-haspopup="dialog"
    :aria-expanded="expanded"
    :aria-controls="controls"
  >
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
    <span class="strand-search-trigger__label">{{ label }}</span>
  </button>
</template>
