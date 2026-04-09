<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Range input control for selecting a numeric value within a bounded interval.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Slider } from '@dillingerstaffing/strand-vue';
  const value = ref(50);
  </script>

  <template>
    <Slider :min="0" :max="100" :step="5" v-model:value="value" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

export interface SliderProps {
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Current value */
  modelValue?: number
  /** Disabled state */
  disabled?: boolean
}

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const wrapperClasses = computed(() =>
  [
    'strand-slider',
    props.disabled && 'strand-slider--disabled',
  ]
    .filter(Boolean)
    .join(' '),
)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <div :class="wrapperClasses">
    <input
      type="range"
      class="strand-slider__field"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue"
      @input="handleInput"
    />
  </div>
</template>
