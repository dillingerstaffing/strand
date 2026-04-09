<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Contextual feedback banner for status messages, warnings, and errors.

  @example
  ```vue
  <script setup>
  import { Alert } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <Alert status="success" dismissible @dismiss="handleDismiss">
      Operation completed successfully.
    </Alert>
  </template>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'

export interface AlertProps {
  /** Visual status of the alert */
  status?: 'info' | 'success' | 'warning' | 'error'
  /** Show dismiss button */
  dismissible?: boolean
}

const props = withDefaults(defineProps<AlertProps>(), {
  status: 'info',
  dismissible: false,
})

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const role = computed(() =>
  props.status === 'error' || props.status === 'warning' ? 'alert' : 'status',
)

const classes = computed(() =>
  [
    'strand-alert',
    `strand-alert--${props.status}`,
  ]
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

function handleDismiss() {
  emit('dismiss')
}
</script>

<template>
  <div :class="classes" :role="role">
    <span class="strand-alert__status">{{ statusLabel }}</span>
    <div class="strand-alert__content">
      <slot />
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="strand-alert__dismiss"
      aria-label="Dismiss"
      @click="handleDismiss"
    >
      &#215;
    </button>
  </div>
</template>
