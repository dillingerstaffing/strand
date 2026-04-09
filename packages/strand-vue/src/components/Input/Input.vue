<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Text input field with optional leading/trailing addons and error state.

  @example
  ```vue
  <script setup>
  import { Input } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Input type="email" placeholder="you@example.com" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'

export interface InputProps {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'search' | 'number'
  /** Show error styling */
  error?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Current value */
  modelValue?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  error: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const slots = useSlots()

const wrapperClasses = computed(() =>
  [
    'strand-input',
    props.error && 'strand-input--error',
    props.disabled && 'strand-input--disabled',
    !!slots.leading && 'strand-input--has-leading',
    !!slots.trailing && 'strand-input--has-trailing',
  ]
    .filter(Boolean)
    .join(' '),
)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div :class="wrapperClasses">
    <span v-if="$slots.leading" class="strand-input__leading" aria-hidden="true">
      <slot name="leading" />
    </span>
    <input
      :type="type"
      class="strand-input__field"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :value="modelValue"
      @input="handleInput"
    />
    <span v-if="$slots.trailing" class="strand-input__trailing" aria-hidden="true">
      <slot name="trailing" />
    </span>
  </div>
</template>
