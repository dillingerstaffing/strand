/*! Strand Svelte | MIT License | dillingerstaffing.com */

// The GEOMETRY belongs to the layout tier in real Chromium. What this file
// pins is the SEMANTIC contract, which is the entire reason this is a
// separate primitive rather than a variant of SearchField. Every assertion
// below fails if someone "simplifies" it back into an input.

import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import SearchTrigger from './SearchTrigger.svelte'

const el = (c: HTMLElement) => c.querySelector('.strand-search-trigger') as HTMLElement

describe('SearchTrigger', () => {
  it('is a button, never an input', () => {
    // WCAG 3.2.1 (On Focus): an input that opens an overlay on focus changes
    // context when focused, throwing a keyboard user into it mid-tab.
    const { container } = render(SearchTrigger)
    expect(el(container).tagName).toBe('BUTTON')
    expect(el(container)).toHaveAttribute('type', 'button')
    expect(container.querySelector('input')).toBeNull()
  })

  it('announces that it opens something rather than that it accepts text', () => {
    const { container } = render(SearchTrigger)
    expect(el(container)).toHaveAttribute('aria-haspopup', 'dialog')
  })

  it('does not claim the search landmark role', () => {
    const { container } = render(SearchTrigger)
    expect(container.querySelector('[role="search"]')).toBeNull()
  })

  it('uses its visible text as its accessible name, with no aria-label override', () => {
    // WCAG 2.5.3 Label in Name: a speech-input user says what they see.
    const { container } = render(SearchTrigger, { props: { label: 'Search events' } })
    expect(el(container).textContent).toContain('Search events')
    expect(el(container).hasAttribute('aria-label')).toBe(false)
  })

  it('shares the field box so the two controls cannot drift apart', () => {
    const { container } = render(SearchTrigger)
    expect(el(container).classList.contains('strand-search-field')).toBe(true)
  })

  it('spans its container when asked', () => {
    const { container } = render(SearchTrigger, { props: { variant: 'full' } })
    expect(el(container).classList.contains('strand-search-field--full')).toBe(true)
  })

  it('reports the overlay state when the consumer drives it', () => {
    const { container } = render(SearchTrigger, {
      props: { expanded: true, controls: 'palette' },
    })
    expect(el(container)).toHaveAttribute('aria-expanded', 'true')
    expect(el(container)).toHaveAttribute('aria-controls', 'palette')
  })

  it('omits aria-expanded entirely when no overlay state is supplied', () => {
    const { container } = render(SearchTrigger)
    expect(el(container).hasAttribute('aria-expanded')).toBe(false)
  })

  it('activates on click', async () => {
    const onclick = vi.fn()
    const { container } = render(SearchTrigger, { props: { onclick } })
    await fireEvent.click(el(container))
    expect(onclick).toHaveBeenCalledTimes(1)
  })

  it('hides its icon from the accessibility tree', () => {
    const { container } = render(SearchTrigger)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })

  it('carries a consumer class without dropping its own', () => {
    const { container } = render(SearchTrigger, {
      props: { class: 'strand-hide-below-md' },
    })
    expect(el(container).classList.contains('strand-hide-below-md')).toBe(true)
    expect(el(container).classList.contains('strand-search-field')).toBe(true)
  })
})
