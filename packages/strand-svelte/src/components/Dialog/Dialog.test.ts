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

  // -- Composition props, at parity with the Preact and Vue implementations --

  it('centres and pads unchanged when asked for nothing', () => {
    const { container } = render(Dialog, { props: { open: true } })
    const panel = container.querySelector('.strand-dialog__panel')
    expect(panel).not.toHaveClass('strand-dialog__panel--align-start')
    expect(panel).toHaveClass('strand-dialog__panel--pad-lg')
    expect(container.querySelector('.strand-dialog__close')).toBeInTheDocument()
  })

  it('aligns the panel to the start of the viewport when asked', () => {
    const { container } = render(Dialog, { props: { open: true, align: 'start' } })
    expect(container.querySelector('.strand-dialog__panel')).toHaveClass(
      'strand-dialog__panel--align-start',
    )
  })

  it('carries each rung of the padding ladder', () => {
    for (const padding of ['none', 'sm', 'md', 'lg', 'xl'] as const) {
      const { container } = render(Dialog, { props: { open: true, padding } })
      expect(container.querySelector('.strand-dialog__panel')).toHaveClass(
        `strand-dialog__panel--pad-${padding}`,
      )
    }
  })

  it('omits the close button entirely when not dismissible', () => {
    // Absent, not hidden: the focus trap queries the DOM, so a display:none
    // close button still swallows the open focus.
    const { container } = render(Dialog, { props: { open: true, dismissible: false } })
    expect(container.querySelector('.strand-dialog__close')).not.toBeInTheDocument()
  })

  it('still closes on Escape when not dismissible', async () => {
    // Hiding a control must never trap the reader.
    const onclose = vi.fn()
    const { container } = render(Dialog, { props: { open: true, dismissible: false, onclose } })
    await fireEvent.keyDown(container.querySelector('.strand-dialog__backdrop')!, { key: 'Escape' })
    expect(onclose).toHaveBeenCalled()
  })

  it('the accessible name lands on the panel, not on the backdrop', () => {
    // Svelte forwards nothing to a component's DOM by default, so before
    // `$$restProps` reached the panel this dropped the name entirely and every
    // composed overlay announced as an unnamed dialog. Found by writing the
    // Sheet's own test, not by a report.
    const { container } = render(Dialog, { props: { open: true, 'aria-label': 'Filters' } })
    expect(container.querySelector('[role="dialog"]')).toHaveAttribute('aria-label', 'Filters')
    expect(container.querySelector('.strand-dialog__backdrop')).not.toHaveAttribute('aria-label')
  })

  it('anchors the panel to the bottom edge when aligned to end', () => {
    const { container } = render(Dialog, { props: { open: true, align: 'end' } })
    expect(container.querySelector('.strand-dialog__panel')).toHaveClass(
      'strand-dialog__panel--align-end',
    )
  })

  it('the default emits no alignment class, so an untouched consumer is unchanged', () => {
    const { container } = render(Dialog, { props: { open: true } })
    expect(container.querySelector('.strand-dialog__panel')?.className).not.toContain('--align-')
  })

})
