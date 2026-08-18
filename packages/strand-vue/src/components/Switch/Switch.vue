<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Toggle switch for binary on/off settings with optional inline label.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Switch } from '@dillingerstaffing/strand-vue';
  const darkMode = ref(false);
  </script>

  <template>
    <Switch v-model:checked="darkMode" label="Dark mode" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed, ref } from 'vue'

export interface SwitchProps {
  /** Controlled state; leave unset to let the switch own it. */
  checked?: boolean
  /** Initial state of an uncontrolled switch. */
  defaultChecked?: boolean
  disabled?: boolean
  label?: string
  /** `compact` drops the row to 30px on a fine pointer only (DL 14.7). */
  density?: 'comfortable' | 'compact'
}

const props = withDefaults(defineProps<SwitchProps>(), {
  checked: undefined,
  defaultChecked: false,
  disabled: false,
  label: undefined,
  density: 'comfortable',
})
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  (e: 'change', checked: boolean): void
  (e: 'update:checked', checked: boolean): void
}>()

const ownChecked = ref(props.defaultChecked)
const isOn = computed(() => props.checked ?? ownChecked.value)

function toggle() {
  if (props.disabled) return
  const next = !isOn.value
  if (props.checked === undefined) ownChecked.value = next
  emit('change', next)
  emit('update:checked', next)
}
</script>

<template>
  <label :class="['strand-switch', density === 'compact' && 'strand-switch--compact'].filter(Boolean).join(' ')">
    <button type="button" role="switch" v-bind="$attrs" class="strand-switch__track" :aria-checked="isOn ? 'true' : 'false'" :disabled="disabled" @click="toggle">
      <span class="strand-switch__thumb" aria-hidden="true" />
    </button>
    <span v-if="label" class="strand-switch__label">{{ label }}</span>
  </label>
</template>
