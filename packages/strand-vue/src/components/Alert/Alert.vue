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
  /** Severity; error and warning announce assertively. */
  status?: 'info' | 'success' | 'warning' | 'error'
  /** Show the dismiss control. */
  dismissible?: boolean
  /** Accessible name of the dismiss control. */
  dismissLabel?: string
  /** Heading set above the message; the `title` slot takes markup. */
  title?: string
}

const props = withDefaults(defineProps<AlertProps>(), {
  status: 'info',
  dismissible: false,
  dismissLabel: 'Dismiss',
  title: undefined,
})

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const role = computed(() => (props.status === 'error' || props.status === 'warning' ? 'alert' : 'status'))
const classes = computed(() => ['strand-alert', `strand-alert--${props.status}`].join(' '))
const statusLabel = computed(() => (props.status === 'success' ? 'COMPLETE' : props.status.toUpperCase()))
</script>

<template>
  <div :class="classes" :role="role">
    <span class="strand-alert__status">{{ statusLabel }}</span>
    <div class="strand-alert__content">
      <div v-if="title || $slots.title" class="strand-alert__title"><slot name="title">{{ title }}</slot></div>
      <slot />
    </div>
    <div v-if="$slots.action" class="strand-alert__action"><slot name="action" /></div>
    <button v-if="dismissible" type="button" class="strand-alert__dismiss" :aria-label="dismissLabel" @click="emit('dismiss')">&#215;</button>
  </div>
</template>
