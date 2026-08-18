<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Form control wrapper providing label, hint text, error messaging, and required indicator.

  @example
  ```vue
  <script setup>
  import { FormField, Input } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <FormField label="Email" html-for="email" hint="Work email preferred" required>
      <Input id="email" type="email" />
    </FormField>
  </template>
  ```
-->
<script setup lang="ts">
import { type VNode, computed, cloneVNode } from 'vue'

export interface FormFieldProps {
  /** Label text */
  label: string
  /** Associates the label with a form control */
  htmlFor: string
  /** Hint text displayed below the input */
  hint?: string
  /** Error text displayed below the input (replaces hint) */
  error?: string
  /** Confirmation text displayed below the input (replaces hint, yields to error). */
  success?: string
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
    !props.error && props.success && 'strand-form-field--success',
  ]
    .filter(Boolean)
    .join(' '),
)

const messageId = computed(() =>
  props.error
    ? `${props.htmlFor}-error`
    : props.success
      ? `${props.htmlFor}-success`
      : props.hint
        ? `${props.htmlFor}-hint`
        : undefined,
)

// Hand the wrapped control the id of whichever message is showing.
const slots = defineSlots<{ default?: () => VNode[] }>()

const describedControl = computed(() => {
  const nodes = slots.default?.() ?? []
  const msg = messageId.value
  if (!msg || nodes.length !== 1) return nodes
  const only = nodes[0]
  const existing = (only.props as Record<string, unknown> | null)?.[
    'aria-describedby'
  ] as string | undefined
  return [
    cloneVNode(only, {
      'aria-describedby': existing ? `${existing} ${msg}` : msg,
    }),
  ]
})
</script>

<template>
  <div :class="classes">
    <label class="strand-form-field__label" :for="htmlFor">{{ label }}<span v-if="required" class="strand-form-field__required" aria-hidden="true">*</span></label>
    <div class="strand-form-field__control">
      <component :is="() => describedControl" />
    </div>
    <!-- ONE message slot, precedence error > success > hint. A field showing
         "that name is taken" above "Available." argues with itself, so the
         states are exclusive here rather than at each call site. -->
    <p
      v-if="error"
      class="strand-form-field__error"
      :id="`${htmlFor}-error`"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="success"
      class="strand-form-field__success"
      :id="`${htmlFor}-success`"
      role="status"
    >
      {{ success }}
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
