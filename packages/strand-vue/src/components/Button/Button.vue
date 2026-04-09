<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Primary action trigger with multiple visual variants and sizes.

  @example
  ```vue
  <script setup>
  import { Button } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Button variant="primary" size="md" @click="handleClick">
      Submit
    </Button>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

export interface ButtonProps {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Show loading spinner and disable interaction */
  loading?: boolean
  /** Square button for icon-only use */
  iconOnly?: boolean
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset'
  /** Disabled state */
  disabled?: boolean
  /** Stretch to full container width */
  fullWidth?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  iconOnly: false,
  type: 'button',
  disabled: false,
  fullWidth: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() =>
  [
    'strand-btn',
    `strand-btn--${props.variant}`,
    `strand-btn--${props.size}`,
    props.iconOnly && 'strand-btn--icon-only',
    props.fullWidth && 'strand-btn--full-width',
    props.loading && 'strand-btn--loading',
  ]
    .filter(Boolean)
    .join(' '),
)

function handleClick(event: MouseEvent) {
  if (!isDisabled.value) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="isDisabled"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="strand-btn__spinner" aria-hidden="true" />
    <span
      class="strand-btn__content"
      :style="loading ? { visibility: 'hidden' } : undefined"
    >
      <slot />
    </span>
  </button>
</template>
