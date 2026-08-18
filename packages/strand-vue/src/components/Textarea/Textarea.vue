<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Multi-line text input with auto-resize, character count, and error state.

  @example
  ```vue
  <script setup>
  import { ref } from 'vue';
  import { Textarea } from '@dillingerstaffing/strand-vue';
  const text = ref('');
  </script>

  <template>
    <Textarea v-model:value="text" :max-length="500" show-count auto-resize />
  </template>
  ```
-->
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
defineOptions({ inheritAttrs: false })

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

/** Fits the textarea to its content; a zero scrollHeight means no layout engine is running, so the element is left as it was. */
function resize() {
  const el = textareaRef.value
  if (!props.autoResize || !el) return
  const previous = el.style.height
  el.style.height = 'auto'
  const content = el.scrollHeight
  if (content > 0) el.style.height = `${content}px`
  else if (previous) el.style.height = previous
  else if (el.style.length === 0 || (el.style.length === 1 && el.style.height === 'auto')) el.removeAttribute('style')
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
    <textarea v-bind="$attrs"
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
