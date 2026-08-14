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
import { computed } from 'vue'

export interface SwitchProps {
  /** Controlled checked state */
  checked?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Inline label text */
  label?: string
  /**
   * Row density. `comfortable` is the default and is unchanged.
   *
   * `compact` drops the row's floor to 30px ON A FINE POINTER ONLY. DL 14.7
   * makes the floor a property of the input modality (coarse 44, fine 24),
   * and requires a shrink rule to be written inside `@media (pointer: fine)`
   * so touch is untouched by construction rather than by care.
   *
   * OPT-IN, which is 14.7 too: 44px remains the default everywhere. Reach for
   * it where density is the point and the region is pointer-driven.
   */
  density?: 'comfortable' | 'compact'
}

const props = withDefaults(defineProps<SwitchProps>(), {
  density: 'comfortable',
  checked: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'change', checked: boolean): void
}>()

const classes = computed(() =>
  [
    'strand-switch',
    props.density === 'compact' && 'strand-switch--compact',
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
