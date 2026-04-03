/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Alert from './Alert.svelte'

describe('Alert', () => {
  it('renders with default classes', () => {
    const { container } = render(Alert)
    const el = container.querySelector('.strand-alert')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-alert--info')
    expect(el).toHaveAttribute('role', 'status')
  })

  it('applies status classes', () => {
    const statuses = ['info', 'success', 'warning', 'error'] as const
    for (const status of statuses) {
      const { container, unmount } = render(Alert, { props: { status } })
      expect(container.querySelector('.strand-alert')).toHaveClass(`strand-alert--${status}`)
      unmount()
    }
  })

  it('uses alert role for error and warning', () => {
    for (const status of ['error', 'warning'] as const) {
      const { container, unmount } = render(Alert, { props: { status } })
      expect(container.querySelector('.strand-alert')).toHaveAttribute('role', 'alert')
      unmount()
    }
  })

  it('uses status role for info and success', () => {
    for (const status of ['info', 'success'] as const) {
      const { container, unmount } = render(Alert, { props: { status } })
      expect(container.querySelector('.strand-alert')).toHaveAttribute('role', 'status')
      unmount()
    }
  })

  it('shows dismiss button when dismissible', () => {
    const { container } = render(Alert, { props: { dismissible: true } })
    const btn = container.querySelector('.strand-alert__dismiss')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label', 'Dismiss')
  })

  it('does not show dismiss button by default', () => {
    const { container } = render(Alert)
    expect(container.querySelector('.strand-alert__dismiss')).not.toBeInTheDocument()
  })

  it('fires ondismiss callback', async () => {
    const ondismiss = vi.fn()
    const { container } = render(Alert, { props: { dismissible: true, ondismiss } })
    await fireEvent.click(container.querySelector('.strand-alert__dismiss')!)
    expect(ondismiss).toHaveBeenCalled()
  })

  it('has content wrapper', () => {
    const { container } = render(Alert)
    expect(container.querySelector('.strand-alert__content')).toBeInTheDocument()
  })
})
