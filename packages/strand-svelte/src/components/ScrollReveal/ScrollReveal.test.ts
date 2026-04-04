/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import ScrollReveal from './ScrollReveal.svelte'

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
  it('renders with strand-reveal class', () => {
    const { container } = render(ScrollReveal)
    const el = container.querySelector('.strand-reveal')
    expect(el).toBeInTheDocument()
  })

  it('does not apply visible class on initial render', () => {
    const { container } = render(ScrollReveal)
    const el = container.querySelector('.strand-reveal')
    expect(el).not.toHaveClass('strand-reveal--visible')
  })
})
