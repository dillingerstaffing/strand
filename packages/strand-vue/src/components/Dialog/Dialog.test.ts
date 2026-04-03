/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Dialog from './Dialog.vue'

describe('Dialog', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  // -- Rendering --

  it('renders nothing visible when closed', () => {
    const { container } = render(Dialog, {
      props: { open: false },
    })
    expect(container.querySelector('.strand-dialog__backdrop')).toBeNull()
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('renders dialog when open', () => {
    const { getByRole } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    expect(getByRole('dialog')).toBeTruthy()
  })

  it('renders children inside the dialog', () => {
    const { getByRole } = render(Dialog, {
      props: { open: true },
      slots: { default: '<p>Dialog content</p>' },
    })
    expect(getByRole('dialog')).toHaveTextContent('Dialog content')
  })

  // -- ARIA --

  it('has role dialog', () => {
    const { getByRole } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    expect(getByRole('dialog')).toBeTruthy()
  })

  it('has aria-modal true', () => {
    const { getByRole } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    expect(getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('renders title with aria-labelledby linkage', () => {
    const { getByRole, getByText } = render(Dialog, {
      props: { open: true, title: 'My Dialog' },
      slots: { default: 'Content' },
    })
    const dialog = getByRole('dialog')
    const titleEl = getByText('My Dialog')
    const titleId = titleEl.getAttribute('id')
    expect(dialog).toHaveAttribute('aria-labelledby', titleId)
  })

  it('does not set aria-labelledby when no title', () => {
    const { getByRole } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    expect(getByRole('dialog').hasAttribute('aria-labelledby')).toBe(false)
  })

  // -- Title --

  it('renders the title text', () => {
    const { getByText } = render(Dialog, {
      props: { open: true, title: 'Confirm Action' },
      slots: { default: 'Content' },
    })
    expect(getByText('Confirm Action')).toBeTruthy()
  })

  // -- Close button --

  it('close button emits close', async () => {
    const { getByLabelText, emitted } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    await fireEvent.click(getByLabelText('Close'))
    expect(emitted().close).toHaveLength(1)
  })

  // -- Escape key --

  it('Escape key emits close', async () => {
    const { getByRole, emitted } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    await fireEvent.keyDown(getByRole('dialog').parentElement!, {
      key: 'Escape',
    })
    expect(emitted().close).toHaveLength(1)
  })

  it('Escape key does not emit close when closeOnEscape is false', async () => {
    const { getByRole, emitted } = render(Dialog, {
      props: { open: true, closeOnEscape: false },
      slots: { default: 'Content' },
    })
    await fireEvent.keyDown(getByRole('dialog').parentElement!, {
      key: 'Escape',
    })
    expect(emitted().close).toBeUndefined()
  })

  // -- Outside click --

  it('clicking backdrop emits close', async () => {
    const { container, emitted } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    const backdrop = container.querySelector('.strand-dialog__backdrop')!
    await fireEvent.click(backdrop)
    expect(emitted().close).toHaveLength(1)
  })

  it('clicking inside dialog does not emit close', async () => {
    const { getByRole, emitted } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    await fireEvent.click(getByRole('dialog'))
    expect(emitted().close).toBeUndefined()
  })

  it('backdrop click disabled when closeOnOutsideClick is false', async () => {
    const { container, emitted } = render(Dialog, {
      props: { open: true, closeOnOutsideClick: false },
      slots: { default: 'Content' },
    })
    const backdrop = container.querySelector('.strand-dialog__backdrop')!
    await fireEvent.click(backdrop)
    expect(emitted().close).toBeUndefined()
  })

  // -- Scroll lock --

  it('sets body overflow hidden when open', () => {
    render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body overflow when closed', async () => {
    const { rerender } = render(Dialog, {
      props: { open: true },
      slots: { default: 'Content' },
    })
    expect(document.body.style.overflow).toBe('hidden')
    await rerender({ open: false })
    expect(document.body.style.overflow).toBe('')
  })

  // -- Focus trap --

  it('traps focus with Tab cycling within the panel', async () => {
    const { container } = render(Dialog, {
      props: { open: true },
      slots: {
        default: '<button id="first">First</button><button id="last">Last</button>',
      },
    })
    const backdrop = container.querySelector('.strand-dialog__backdrop')!
    const lastBtn = container.querySelector('#last') as HTMLElement
    const closeBtn = container.querySelector('.strand-dialog__close') as HTMLElement

    // Focus the last button
    lastBtn.focus()
    expect(document.activeElement).toBe(lastBtn)

    // Tab from last should wrap to first focusable (close button)
    await fireEvent.keyDown(backdrop, { key: 'Tab' })
    expect(document.activeElement).toBe(closeBtn)
  })

  it('traps focus with Shift+Tab cycling within the panel', async () => {
    const { container, getByRole } = render(Dialog, {
      props: { open: true },
      slots: {
        default: '<button id="first">First</button><button id="last">Last</button>',
      },
    })
    const panel = getByRole('dialog')
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    // Focus the first focusable element in the panel
    first.focus()
    expect(document.activeElement).toBe(first)

    // Simulate Shift+Tab by creating and dispatching a KeyboardEvent on the panel
    // which will bubble to the backdrop's keydown handler
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    first.dispatchEvent(event)
    expect(document.activeElement).toBe(last)
  })
})
