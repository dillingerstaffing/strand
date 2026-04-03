<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  /** Array of options to display */
  options: SelectOption[]
  /** Disabled state */
  disabled?: boolean
  /** Currently selected value */
  modelValue?: string
  /** Show error styling */
  error?: boolean
  /** Placeholder text shown as first disabled option */
  placeholder?: string
}

const props = withDefaults(defineProps<SelectProps>(), {
  disabled: false,
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const wrapperClasses = computed(() =>
  [
    'strand-select',
    props.error && 'strand-select--error',
    props.disabled && 'strand-select--disabled',
  ]
    .filter(Boolean)
    .join(' '),
)

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div :class="wrapperClasses">
    <select
      class="strand-select__field"
      :value="modelValue"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      @change="handleChange"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
    <span class="strand-select__arrow" aria-hidden="true" />
  </div>
</template>
