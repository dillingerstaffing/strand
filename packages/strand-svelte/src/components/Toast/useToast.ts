/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

export type ToastStatus = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  message: string
  status?: ToastStatus
  duration?: number
}

export interface ToastEntry {
  id: number
  message: string
  status: ToastStatus
  duration: number
}

export interface ToastContextValue {
  toasts: Writable<ToastEntry[]>
  toast: (options: ToastOptions) => void
  removeToast: (id: number) => void
}

const TOAST_KEY = Symbol('StrandToast')

let toastIdCounter = 0

export function createToastContext(): ToastContextValue {
  const toasts = writable<ToastEntry[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()

  function removeToast(id: number) {
    const timer = timers.get(id)
    if (timer !== undefined) {
      clearTimeout(timer)
      timers.delete(id)
    }
    toasts.update((prev) => prev.filter((t) => t.id !== id))
  }

  function addToast(options: ToastOptions) {
    const entry: ToastEntry = {
      id: ++toastIdCounter,
      message: options.message,
      status: options.status ?? 'info',
      duration: options.duration ?? 5000,
    }
    toasts.update((prev) => [...prev, entry])

    if (entry.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(entry.id)
      }, entry.duration)
      timers.set(entry.id, timer)
    }
  }

  const ctx: ToastContextValue = {
    toasts,
    toast: addToast,
    removeToast,
  }

  setContext(TOAST_KEY, ctx)
  return ctx
}

export function getToastContext(): ToastContextValue {
  const ctx = getContext<ToastContextValue>(TOAST_KEY)
  if (!ctx) {
    throw new Error('getToastContext must be used within a ToastProvider')
  }
  return ctx
}
