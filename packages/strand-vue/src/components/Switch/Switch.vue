<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

export interface SwitchProps {
  /** Controlled checked state */
  checked?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Inline label text */
  label?: string
}

const props = withDefaults(defineProps<SwitchProps>(), {
  checked: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'change', checked: boolean): void
}>()

const classes = computed(() =>
  [
    'strand-switch',
    props.checked && 'strand-switch--checked',
    props.disabled && 'strand-switch--disabled',
  ]
    .filter(Boolean)
    .join(' '),
)

function handleClick() {
  if (!props.disabled) {
    emit('change', !props.checked)
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if ((event.key === ' ' || event.key === 'Enter') && !props.disabled) {
    event.preventDefault()
    emit('change', !props.checked)
  }
}
</script>

<template>
  <label :class="classes">
    <button
      type="button"
      role="switch"
      class="strand-switch__track"
      :aria-checked="checked ? 'true' : 'false'"
      :disabled="disabled"
      @click="handleClick"
      @keydown="handleKeyDown"
    >
      <span class="strand-switch__thumb" aria-hidden="true" />
    </button>
    <span v-if="label" class="strand-switch__label">{{ label }}</span>
  </label>
</template>
