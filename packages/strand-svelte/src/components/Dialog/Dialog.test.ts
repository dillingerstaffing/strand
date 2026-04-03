/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Dialog from './Dialog.svelte'

describe('Dialog', () => {
  it('does not render when closed', () => {
    const { container } = render(Dialog, { props: { open: false } })
    expect(container.querySelector('.strand-dialog__backdrop')).not.toBeInTheDocument()
  })

  it('renders backdrop and panel when open', () => {
    const { container } = render(Dialog, { props: { open: true } })
    expect(container.querySelector('.strand-dialog__backdrop')).toBeInTheDocument()
    const panel = container.querySelector('.strand-dialog__panel')
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('role', 'dialog')
    expect(panel).toHaveAttribute('aria-modal', 'true')
  })

  it('renders title when provided', () => {
    const { container } = render(Dialog, { props: { open: true, title: 'Confirm' } })
    const header = container.querySelector('.strand-dialog__header')
    expect(header).toBeInTheDocument()
    const titleEl = container.querySelector('.strand-dialog__title')
    expect(titleEl).toHaveTextContent('Confirm')
    const panel = container.querySelector('.strand-dialog__panel')
    expect(panel).toHaveAttribute('aria-labelledby', titleEl!.id)
  })

  it('does not render title when not provided', () => {
    const { container } = render(Dialog, { props: { open: true } })
    expect(container.querySelector('.strand-dialog__header')).not.toBeInTheDocument()
    expect(container.querySelector('.strand-dialog__panel')).not.toHaveAttribute('aria-labelledby')
  })

  it('has close button', () => {
    const { container } = render(Dialog, { props: { open: true } })
    const close = container.querySelector('.strand-dialog__close')
    expect(close).toBeInTheDocument()
    expect(close).toHaveAttribute('aria-label', 'Close')
  })

  it('fires onclose on close button click', async () => {
    const onclose = vi.fn()
    const { container } = render(Dialog, { props: { open: true, onclose } })
    await fireEvent.click(container.querySelector('.strand-dialog__close')!)
    expect(onclose).toHaveBeenCalled()
  })

  it('fires onclose on backdrop click', async () => {
    const onclose = vi.fn()
    const { container } = render(Dialog, { props: { open: true, onclose } })
    await fireEvent.click(container.querySelector('.strand-dialog__backdrop')!)
    expect(onclose).toHaveBeenCalled()
  })

  it('fires onclose on Escape key', async () => {
    const onclose = vi.fn()
    const { container } = render(Dialog, { props: { open: true, onclose } })
    await fireEvent.keyDown(container.querySelector('.strand-dialog__backdrop')!, { key: 'Escape' })
    expect(onclose).toHaveBeenCalled()
  })

  it('does not fire onclose on Escape when closeOnEscape is false', async () => {
    const onclose = vi.fn()
    const { container } = render(Dialog, { props: { open: true, closeOnEscape: false, onclose } })
    await fireEvent.keyDown(container.querySelector('.strand-dialog__backdrop')!, { key: 'Escape' })
    expect(onclose).not.toHaveBeenCalled()
  })

  it('has dialog body', () => {
    const { container } = render(Dialog, { props: { open: true } })
    expect(container.querySelector('.strand-dialog__body')).toBeInTheDocument()
  })
})
