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
  /** Controlled checked state */
  checked?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Label text */
  label?: string
  /** Radio group name */
  name?: string
  /** Radio value */
  value?: string
}

const props = withDefaults(defineProps<RadioProps>(), {
  checked: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'change', event: Event): void
}>()

const classes = computed(() =>
  [
    'strand-radio',
    props.checked && 'strand-radio--checked',
    props.disabled && 'strand-radio--disabled',
  ]
    .filter(Boolean)
    .join(' '),
)

function handleChange(event: Event) {
  if (!props.disabled) {
    emit('change', event)
  }
}
</script>

<template>
  <label :class="classes">
    <input
      type="radio"
      class="strand-radio__native"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      :value="value"
      @change="handleChange"
    />
    <span class="strand-radio__control" aria-hidden="true">
      <span class="strand-radio__dot" />
    </span>
    <span v-if="label" class="strand-radio__label">{{ label }}</span>
  </label>
</template>
