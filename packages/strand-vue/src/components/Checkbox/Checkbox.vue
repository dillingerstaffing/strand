<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Toggle control for boolean or indeterminate selections with optional label.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Checkbox } from '@dillingerstaffing/strand-vue';
  const accepted = ref(false);
  </script>

  <template>
    <Checkbox v-model:checked="accepted" label="Accept terms" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'

export interface CheckboxProps {
  /** Controlled checked state */
  checked?: boolean
  /** Indeterminate visual state */
  indeterminate?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Label text */
  label?: string
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  checked: false,
  indeterminate: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'change', event: Event): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
})

watch(() => props.indeterminate, (val) => {
  if (inputRef.value) {
    inputRef.value.indeterminate = val
  }
})

const classes = computed(() =>
  [
    'strand-checkbox',
    props.checked && 'strand-checkbox--checked',
    props.indeterminate && 'strand-checkbox--indeterminate',
    props.disabled && 'strand-checkbox--disabled',
  ]
    .filter(Boolean)
    .join(' '),
)

const ariaChecked = computed(() =>
  props.indeterminate ? 'mixed' : props.checked ? 'true' : 'false',
)

function handleChange(event: Event) {
  if (!props.disabled) {
    emit('change', event)
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === ' ' && !props.disabled) {
    event.preventDefault()
    if (inputRef.value) {
      inputRef.value.click()
    }
  }
}
</script>

<template>
  <label :class="classes" @keydown="handleKeyDown">
    <input
      ref="inputRef"
      type="checkbox"
      class="strand-checkbox__native"
      :checked="checked"
      :disabled="disabled"
      :aria-checked="ariaChecked"
      role="checkbox"
      @change="handleChange"
    />
    <span class="strand-checkbox__control" aria-hidden="true">
      <svg
        v-if="indeterminate"
        class="strand-checkbox__icon"
        viewBox="0 0 16 16"
        fill="none"
      >
        <line
          x1="4"
          y1="8"
          x2="12"
          y2="8"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <svg
        v-else-if="checked"
        class="strand-checkbox__icon"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.5 8L6.5 11L12.5 5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span v-if="label" class="strand-checkbox__label">{{ label }}</span>
  </label>
</template>
