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
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => number
  /** Removes the toast with that id, if it is still showing. */
  dismiss: (id: number) => void
  /** Kept for consumers on the earlier name. */
  removeToast: (id: number) => void
  /** Pause and resume a toast's auto-dismiss (the provider wires these to hover and focus). */
  hold: (id: number) => void
  release: (id: number) => void
}

export interface ToastContextOptions {
  /** How many toasts show at once; the oldest leaves when a new one arrives past it. Unbounded by default. */
  maxCount?: number
  /** Auto-dismiss waits while the pointer or focus is on a toast (WCAG 2.2.1). */
  pauseOnHover?: boolean
}

const TOAST_KEY = Symbol('StrandToast')

let toastIdCounter = 0

export function createToastContext(options: ToastContextOptions = {}): ToastContextValue {
  const maxCount = Math.max(1, options.maxCount ?? Number.POSITIVE_INFINITY)
  const pauseOnHover = options.pauseOnHover ?? true
  const toasts = writable<ToastEntry[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  const entries = new Map<number, ToastEntry>()

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
    entries.delete(id)
    toasts.update((prev) => prev.filter((t) => t.id !== id))
  }
  function toast(options: ToastOptions): number {
    const entry: ToastEntry = {
      id: ++toastIdCounter,
      message: options.message,
      status: options.status ?? 'info',
      duration: options.duration ?? 5000,
    }
    entries.set(entry.id, entry)
    toasts.update((prev) => {
      const next = [...prev, entry]
      for (const e of next.slice(0, Math.max(0, next.length - maxCount))) {
        clearTimer(e.id)
        entries.delete(e.id)
      }
      return next.slice(-maxCount)
    })
    startTimer(entry)
    return entry.id
  }
  function hold(id: number) {
    if (pauseOnHover) clearTimer(id)
  }
  function release(id: number) {
    const entry = entries.get(id)
    if (pauseOnHover && entry && !timers.has(id)) startTimer(entry)
  }

  const ctx: ToastContextValue = { toasts, toast, dismiss, removeToast: dismiss, hold, release }
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
