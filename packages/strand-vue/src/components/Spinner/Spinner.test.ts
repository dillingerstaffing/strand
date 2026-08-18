import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Spinner from './Spinner.vue'

describe('Spinner', () => {
  // ── Rendering ──

  it('renders a span element', () => {
    const { container } = render(Spinner)
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  it('has status role', () => {
    const { getByRole } = render(Spinner)
    expect(getByRole('status')).toBeTruthy()
  })

  // ── Inner elements ──

  it('renders a ring span with aria-hidden', () => {
    const { container } = render(Spinner)
    const ring = container.querySelector('.strand-spinner__ring')
    expect(ring).toBeTruthy()
    expect(ring?.getAttribute('aria-hidden')).toBe('true')
  })

  it('reads Loading, or the given label, through the shared visually hidden utility', () => {
    const { container } = render(Spinner)
    expect(container.querySelector('.strand-sr-only')?.textContent).toBe('Loading')
    const named = render(Spinner, { props: { label: 'Loading events' } })
    expect(named.container.querySelector('.strand-sr-only')?.textContent).toBe('Loading events')
  })

  // ── Sizes ──

  it('applies md size class by default', () => {
    const { container } = render(Spinner)
    expect(container.firstElementChild?.className).toContain('strand-spinner--md')
  })

  it('applies sm size class', () => {
    const { container } = render(Spinner, { props: { size: 'sm' } })
    expect(container.firstElementChild?.className).toContain('strand-spinner--sm')
  })

  it('applies lg size class', () => {
    const { container } = render(Spinner, { props: { size: 'lg' } })
    expect(container.firstElementChild?.className).toContain('strand-spinner--lg')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Spinner, { props: { className: 'custom' } })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-spinner')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(Spinner, { attrs: { id: 'my-spinner' } })
    expect(container.firstElementChild?.getAttribute('id')).toBe('my-spinner')
  })
})
