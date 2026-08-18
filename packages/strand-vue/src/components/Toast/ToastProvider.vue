<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Context provider that manages toast notifications for its subtree.

  @example
  ```vue
  <script setup>
  import { ToastProvider } from '@dillingerstaffing/strand-vue';
  </script>

  <template>
    <ToastProvider>
      <App />
    </ToastProvider>
  </template>
  ```
-->
<script setup lang="ts">
import { onUnmounted, provide, ref } from 'vue'
import { ToastKey } from './useToast'
import type { ToastOptions, ToastStatus } from './useToast'

interface Props {
  /** How many toasts show at once; the oldest leaves when a new one arrives past it. Unbounded by default. */
  maxCount?: number
  /** Auto-dismiss waits while the pointer or focus is on a toast (WCAG 2.2.1). */
  pauseOnHover?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  maxCount: Number.POSITIVE_INFINITY,
  pauseOnHover: true,
})

interface ToastEntry {
  id: number
  message: string
  status: ToastStatus
  duration: number
}

let toastIdCounter = 0
const toasts = ref<ToastEntry[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function clearTimer(id: number) {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
}
function startTimer(entry: ToastEntry) {
  if (entry.duration <= 0) return
  timers.set(entry.id, setTimeout(() => dismiss(entry.id), entry.duration))
}
function dismiss(id: number) {
  clearTimer(id)
  toasts.value = toasts.value.filter((t) => t.id !== id)
}
function toast(options: ToastOptions): number {
  const entry: ToastEntry = {
    id: ++toastIdCounter,
    message: options.message,
    status: options.status ?? 'info',
    duration: options.duration ?? 5000,
  }
  const next = [...toasts.value, entry]
  const evicted = next.slice(0, Math.max(0, next.length - Math.max(1, props.maxCount)))
  for (const e of evicted) clearTimer(e.id)
  toasts.value = next.slice(-Math.max(1, props.maxCount))
  startTimer(entry)
  return entry.id
}
function hold(entry: ToastEntry) {
  if (props.pauseOnHover) clearTimer(entry.id)
}
function release(entry: ToastEntry) {
  if (props.pauseOnHover && !timers.has(entry.id)) startTimer(entry)
}

provide(ToastKey, { toast, dismiss })

onUnmounted(() => {
  for (const timer of timers.values()) clearTimeout(timer)
  timers.clear()
})

function isUrgent(status: ToastStatus): boolean {
  return status === 'error' || status === 'warning'
}
const statusLabels: Record<string, string> = { info: 'INFO', success: 'COMPLETE', warning: 'WARNING', error: 'ERROR' }
function statusLabel(status: ToastStatus): string {
  return statusLabels[status] ?? status.toUpperCase()
}
</script>

<template>
  <slot />
  <div v-if="toasts.length > 0" class="strand-toast__container">
    <div
      v-for="entry in toasts"
      :key="entry.id"
      :class="['strand-toast', `strand-toast--${entry.status}`].join(' ')"
      :role="isUrgent(entry.status) ? 'alert' : 'status'"
      :aria-live="isUrgent(entry.status) ? 'assertive' : 'polite'"
      @mouseenter="hold(entry)"
      @mouseleave="release(entry)"
      @focusin="hold(entry)"
      @focusout="release(entry)"
    >
      <span class="strand-toast__status">{{ statusLabel(entry.status) }}</span>
      <span class="strand-toast__message">{{ entry.message }}</span>
      <button type="button" class="strand-toast__dismiss" aria-label="Dismiss" @click="dismiss(entry.id)">
        &#215;
      </button>
    </div>
  </div>
</template>
