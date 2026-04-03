/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Toast from './Toast.svelte'

describe('Toast', () => {
  it('renders with default classes', () => {
    const { container } = render(Toast, { props: { message: 'Hello' } })
    const el = container.querySelector('.strand-toast')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-toast--info')
    expect(el).toHaveAttribute('role', 'status')
    expect(el).toHaveAttribute('aria-live', 'polite')
  })

  it('renders message text', () => {
    const { container } = render(Toast, { props: { message: 'Saved!' } })
    expect(container.querySelector('.strand-toast__message')).toHaveTextContent('Saved!')
  })

  it('applies status classes', () => {
    const statuses = ['info', 'success', 'warning', 'error'] as const
    for (const status of statuses) {
      const { container, unmount } = render(Toast, { props: { message: 'Test', status } })
      expect(container.querySelector('.strand-toast')).toHaveClass(`strand-toast--${status}`)
      unmount()
    }
  })

  it('uses assertive aria-live for error and warning', () => {
    for (const status of ['error', 'warning'] as const) {
      const { container, unmount } = render(Toast, { props: { message: 'Test', status } })
      expect(container.querySelector('.strand-toast')).toHaveAttribute('aria-live', 'assertive')
      unmount()
    }
  })

  it('uses polite aria-live for info and success', () => {
    for (const status of ['info', 'success'] as const) {
      const { container, unmount } = render(Toast, { props: { message: 'Test', status } })
      expect(container.querySelector('.strand-toast')).toHaveAttribute('aria-live', 'polite')
      unmount()
    }
  })

  it('has dismiss button with aria-label', () => {
    const { container } = render(Toast, { props: { message: 'Test' } })
    const btn = container.querySelector('.strand-toast__dismiss')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label', 'Dismiss')
  })

  it('fires ondismiss callback', async () => {
    const ondismiss = vi.fn()
    const { container } = render(Toast, { props: { message: 'Test', ondismiss } })
    await fireEvent.click(container.querySelector('.strand-toast__dismiss')!)
    expect(ondismiss).toHaveBeenCalled()
  })

  it('renders status prefix for info', () => {
    const { container } = render(Toast, { props: { message: 'Note', status: 'info' } })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('INFO')
  })

  it('renders status prefix for success as COMPLETE', () => {
    const { container } = render(Toast, { props: { message: 'OK', status: 'success' } })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('COMPLETE')
  })

  it('renders status prefix for warning', () => {
    const { container } = render(Toast, { props: { message: 'Warn', status: 'warning' } })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('WARNING')
  })

  it('renders status prefix for error', () => {
    const { container } = render(Toast, { props: { message: 'Fail', status: 'error' } })
    const status = container.querySelector('.strand-toast__status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent('ERROR')
  })
})
