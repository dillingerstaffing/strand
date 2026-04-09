<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Standalone notification message with status indicator and optional dismiss.

  @example
  ```vue
  <script setup>
  import { Toast } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Toast status="success" message="Changes saved." @dismiss="handleDismiss" />
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'
import type { ToastStatus } from './useToast'

export interface ToastProps {
  /** Visual status */
  status?: ToastStatus
  /** Toast message text */
  message: string
}

const props = withDefaults(defineProps<ToastProps>(), {
  status: 'info',
})

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const isUrgent = computed(
  () => props.status === 'error' || props.status === 'warning',
)

const classes = computed(() =>
  ['strand-toast', `strand-toast--${props.status}`]
    .filter(Boolean)
    .join(' '),
)

const statusLabels: Record<string, string> = {
  info: 'INFO',
  success: 'COMPLETE',
  warning: 'WARNING',
  error: 'ERROR',
}

const statusLabel = computed(() => statusLabels[props.status] ?? props.status.toUpperCase())
</script>

<template>
  <div
    :class="classes"
    role="status"
    :aria-live="isUrgent ? 'assertive' : 'polite'"
  >
    <span class="strand-toast__status">{{ statusLabel }}</span>
    <span class="strand-toast__message">{{ message }}</span>
    <button
      type="button"
      class="strand-toast__dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      &#215;
    </button>
  </div>
</template>
