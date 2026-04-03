<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

export interface TextareaProps {
  /** Auto-resize to fit content */
  autoResize?: boolean
  /** Show character count (requires maxLength) */
  showCount?: boolean
  /** Show error styling */
  error?: boolean
  /** Maximum character count */
  maxLength?: number
  /** Disabled state */
  disabled?: boolean
  /** Controlled value */
  modelValue?: string
}

const props = withDefaults(defineProps<TextareaProps>(), {
  autoResize: false,
  showCount: false,
  error: false,
  disabled: false,
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const wrapperClasses = computed(() =>
  [
    'strand-textarea',
    props.error && 'strand-textarea--error',
    props.disabled && 'strand-textarea--disabled',
    props.autoResize && 'strand-textarea--auto-resize',
  ]
    .filter(Boolean)
    .join(' '),
)

const currentLength = computed(() =>
  typeof props.modelValue === 'string' ? props.modelValue.length : 0,
)

function resize() {
  if (props.autoResize && textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  resize()
}

watch(() => props.modelValue, () => {
  resize()
})

onMounted(() => {
  resize()
})
</script>

<template>
  <div :class="wrapperClasses">
    <textarea
      ref="textareaRef"
      class="strand-textarea__field"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :maxlength="maxLength"
      :value="modelValue"
      @input="handleInput"
    />
    <span
      v-if="showCount && maxLength != null"
      class="strand-textarea__count"
      aria-live="polite"
    >
      {{ currentLength }}/{{ maxLength }}
    </span>
  </div>
</template>
