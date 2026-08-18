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
import { computed, ref, watchEffect } from 'vue'

export interface CheckboxProps {
  /** Controlled state; leave unset to let the input own it. */
  checked?: boolean
  /** Initial state of an uncontrolled checkbox. */
  defaultChecked?: boolean
  /** Mixed state; the DOM property, so :indeterminate paints and announces it. */
  indeterminate?: boolean
  disabled?: boolean
  label?: string
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: 'comfortable' | 'compact'
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  indeterminate: false,
  disabled: false,
  label: undefined,
  density: 'comfortable',
})

const emit = defineEmits<{
  (e: 'change', event: Event): void
  (e: 'update:checked', checked: boolean): void
}>()

const input = ref<HTMLInputElement | null>(null)
watchEffect(
  () => {
    if (input.value) input.value.indeterminate = props.indeterminate
  },
  { flush: 'sync' },
)

const state = computed(() => (props.checked === undefined ? { defaultChecked: props.defaultChecked } : { checked: props.checked }))

function onChange(event: Event) {
  if (props.disabled) return
  emit('change', event)
  emit('update:checked', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label :class="['strand-checkbox', density === 'compact' && 'strand-checkbox--compact'].filter(Boolean).join(' ')">
    <input ref="input" type="checkbox" class="strand-checkbox__native" v-bind="state" :disabled="disabled" @change="onChange" />
    <span class="strand-checkbox__control" aria-hidden="true">
      <svg class="strand-checkbox__icon strand-checkbox__icon--check" viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg class="strand-checkbox__icon strand-checkbox__icon--mixed" viewBox="0 0 16 16" fill="none">
        <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </span>
    <span v-if="label" class="strand-checkbox__label">{{ label }}</span>
  </label>
</template>
