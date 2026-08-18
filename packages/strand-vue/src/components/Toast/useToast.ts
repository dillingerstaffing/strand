/*! Strand Vue | MIT License | dillingerstaffing.com */

import { inject } from 'vue'
import type { InjectionKey } from 'vue'

export type ToastStatus = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  message: string
  status?: ToastStatus
  duration?: number
}

export interface ToastContextValue {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => number
  /** Removes the toast with that id, if it is still showing. */
  dismiss: (id: number) => void
}

export const ToastKey: InjectionKey<ToastContextValue> = Symbol('StrandToast')

export function useToast(): ToastContextValue {
  const ctx = inject(ToastKey)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
