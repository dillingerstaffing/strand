<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<script setup lang="ts">
import { ref, provide, onUnmounted } from 'vue'
import { ToastKey } from './useToast'
import type { ToastOptions, ToastStatus } from './useToast'

interface ToastEntry {
  id: number
  message: string
  status: ToastStatus
  duration: number
}

let toastIdCounter = 0

const toasts = ref<ToastEntry[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function removeToast(id: number) {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function addToast(options: ToastOptions) {
  const entry: ToastEntry = {
    id: ++toastIdCounter,
    message: options.message,
    status: options.status ?? 'info',
    duration: options.duration ?? 5000,
  }
  toasts.value = [...toasts.value, entry]

  if (entry.duration > 0) {
    const timer = setTimeout(() => {
      removeToast(entry.id)
    }, entry.duration)
    timers.set(entry.id, timer)
  }
}

provide(ToastKey, { toast: addToast })

onUnmounted(() => {
  for (const timer of timers.values()) {
    clearTimeout(timer)
  }
  timers.clear()
})

function isUrgent(status: ToastStatus): boolean {
  return status === 'error' || status === 'warning'
}
</script>

<template>
  <slot />
  <div v-if="toasts.length > 0" class="strand-toast__container">
    <div
      v-for="entry in toasts"
      :key="entry.id"
      :class="['strand-toast', `strand-toast--${entry.status}`].join(' ')"
      role="status"
      :aria-live="isUrgent(entry.status) ? 'assertive' : 'polite'"
    >
      <span class="strand-toast__message">{{ entry.message }}</span>
      <button
        type="button"
        class="strand-toast__dismiss"
        aria-label="Dismiss"
        @click="removeToast(entry.id)"
      >
        &#215;
      </button>
    </div>
  </div>
</template>
