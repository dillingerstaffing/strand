/*! Strand Vue | MIT License | dillingerstaffing.com */

// The parity claim is that every framework wrapper renders the SAME classes,
// so these assert the class contract rather than re-testing Dialog's behaviour.
//
// The drag is deliberately absent: jsdom implements no PointerEvent, so
// `fireEvent.pointerDown(el, { clientY: 100 })` delivers coordinates of null
// and a test written here would assert that nothing happened. The gesture's
// decision is exhausted as a pure function in strand-ui, and its geometry in
// the browser layout tier.

import { describe, it, expect, afterEach } from 'vitest'
import { render } from '@testing-library/vue'
import Sheet from './Sheet.vue'

describe('Sheet', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders nothing visible when closed', () => {
    const { container } = render(Sheet, { props: { open: false, label: 'Filters' } })
    expect(container.querySelector('.strand-sheet__panel')).toBeNull()
  })

  it('anchors to the bottom edge, which is the whole pattern', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    const panel = container.querySelector('.strand-dialog__panel')
    expect(panel?.className).toContain('strand-dialog__panel--align-end')
  })

  it('carries no inner padding of its own, because its parts own their insets', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    expect(container.querySelector('.strand-dialog__panel')?.className).toContain(
      'strand-dialog__panel--pad-none',
    )
  })

  it('renders a scrolling body for its content', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    expect(container.querySelector('.strand-sheet__body')).not.toBeNull()
  })

  it('renders the grabber, because a drag nobody can see is a gesture only its author knows', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    expect(container.querySelector('.strand-sheet__grab')).not.toBeNull()
    expect(container.querySelector('.strand-sheet__grabber')?.getAttribute('aria-hidden')).toBe(
      'true',
    )
  })

  it('a sheet that cannot be dragged renders no grabber, rather than one that does nothing', () => {
    const { container } = render(Sheet, {
      props: { open: true, label: 'Filters', draggable: false },
    })
    expect(container.querySelector('.strand-sheet__grab')).toBeNull()
  })

  it('renders no foot when there is no action, rather than an empty band', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    expect(container.querySelector('.strand-sheet__foot')).toBeNull()
  })

  it('renders a foot holding the action, which never scrolls away', () => {
    const { container } = render(Sheet, {
      props: { open: true, label: 'Filters' },
      slots: { action: '<button type="button">Show 6 events</button>' },
    })
    expect(container.querySelector('.strand-sheet__foot')?.textContent).toContain('Show 6 events')
  })

  it('renders no head when there is nothing in it, so the body is the first row', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    expect(container.querySelector('.strand-sheet__head')).toBeNull()
  })

  it('the reader using a screen reader is told what the sheet is', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    expect(container.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Filters')
  })

  it('renders no close X, because the pattern dismisses by gesture, Escape or backdrop', () => {
    const { container } = render(Sheet, { props: { open: true, label: 'Filters' } })
    expect(container.querySelector('.strand-dialog__close')).toBeNull()
  })
})
