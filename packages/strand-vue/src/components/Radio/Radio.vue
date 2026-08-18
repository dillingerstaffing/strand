<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Single-selection control for use within a radio group.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Radio } from '@dillingerstaffing/strand-vue';
  const selected = ref('pro');
  </script>

  <template>
    <Radio name="plan" value="pro" label="Pro" :checked="selected === 'pro'" @change="selected = 'pro'" />
    <Radio name="plan" value="free" label="Free" :checked="selected === 'free'" @change="selected = 'free'" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

export interface RadioProps {
  /** Controlled state; leave unset to let the input own it. */
  checked?: boolean
  /** Initial state of an uncontrolled radio. */
  defaultChecked?: boolean
  disabled?: boolean
  label?: string
  /** Radio group name */
  name?: string
  /** Radio value */
  value?: string
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: 'comfortable' | 'compact'
}

const props = withDefaults(defineProps<RadioProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: false,
  label: undefined,
  name: undefined,
  value: undefined,
  density: 'comfortable',
})

const emit = defineEmits<{
  (e: 'change', event: Event): void
  (e: 'update:checked', checked: boolean): void
}>()

const state = computed(() => (props.checked === undefined ? { defaultChecked: props.defaultChecked } : { checked: props.checked }))

function onChange(event: Event) {
  if (props.disabled) return
  emit('change', event)
  emit('update:checked', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label :class="['strand-radio', density === 'compact' && 'strand-radio--compact'].filter(Boolean).join(' ')">
    <input type="radio" class="strand-radio__native" v-bind="state" :disabled="disabled" :name="name" :value="value" @change="onChange" />
    <span class="strand-radio__control" aria-hidden="true">
      <span class="strand-radio__dot" />
    </span>
    <span v-if="label" class="strand-radio__label">{{ label }}</span>
  </label>
</template>
