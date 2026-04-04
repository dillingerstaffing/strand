import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/vue'
import ScrollReveal from './ScrollReveal.vue'

// Mock IntersectionObserver (not available in jsdom)
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

beforeEach(() => {
  mockObserve.mockClear()
  mockUnobserve.mockClear()
  mockDisconnect.mockClear()

  global.IntersectionObserver = vi.fn(() => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: () => [],
  })) as unknown as typeof IntersectionObserver
})

describe('ScrollReveal', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(ScrollReveal, { slots: { default: 'Content' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders slot content', () => {
    const { getByText } = render(ScrollReveal, { slots: { default: 'Reveal me' } })
    expect(getByText('Reveal me')).toBeTruthy()
  })

  // ── Base class ──

  it('applies strand-reveal class', () => {
    const { container } = render(ScrollReveal, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-reveal')
  })

  // ── Visible class (not applied until intersection) ──

  it('does not apply visible class on initial render', () => {
    const { container } = render(ScrollReveal, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).not.toContain('strand-reveal--visible')
  })

  // ── Custom className ──

  it('merges custom className with component classes', () => {
    const { container } = render(ScrollReveal, {
      props: { className: 'custom' },
      slots: { default: 'Test' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-reveal')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(ScrollReveal, {
      attrs: { id: 'reveal-1', 'data-testid': 'my-reveal' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('reveal-1')
  })
})
