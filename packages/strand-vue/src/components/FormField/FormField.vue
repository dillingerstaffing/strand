<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed } from 'vue'

export interface FormFieldProps {
  /** Label text */
  label: string
  /** Associates the label with a form control */
  htmlFor: string
  /** Hint text displayed below the input */
  hint?: string
  /** Error text displayed below the input (replaces hint) */
  error?: string
  /** Show required indicator */
  required?: boolean
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  required: false,
})

const classes = computed(() =>
  [
    'strand-form-field',
    props.error && 'strand-form-field--error',
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div :class="classes">
    <label class="strand-form-field__label" :for="htmlFor">
      {{ label }}
      <span v-if="required" class="strand-form-field__required" aria-hidden="true">
        *
      </span>
    </label>
    <div class="strand-form-field__control">
      <slot />
    </div>
    <p
      v-if="error"
      class="strand-form-field__error"
      :id="`${htmlFor}-error`"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      class="strand-form-field__hint"
      :id="`${htmlFor}-hint`"
    >
      {{ hint }}
    </p>
  </div>
</template>
