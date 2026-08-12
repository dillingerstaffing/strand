/*! Strand vue | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import MapLegend from './MapLegend.vue'

const ITEMS = [
  { category: 'tech' as const, label: 'Technology' },
  { category: 'health' as const, label: 'Health' },
]

describe('MapLegend', () => {
  it('renders a titled key with one row per category', () => {
    const { container } = render(MapLegend, { props: { items: ITEMS } })
    expect(container.querySelector('.strand-map-legend__title')?.textContent?.trim()).toBe('Legend')
    expect(container.querySelectorAll('.strand-map-legend__item')).toHaveLength(2)
  })

  it('draws the sector dot for each category', () => {
    const { container } = render(MapLegend, { props: { items: ITEMS } })
    expect(container.querySelector('.strand-map-legend__dot--tech')).not.toBeNull()
    expect(container.querySelector('.strand-map-legend__dot--health')).not.toBeNull()
  })

  it('hides the dot from the accessibility tree', () => {
    const { container } = render(MapLegend, { props: { items: ITEMS } })
    expect(container.querySelector('.strand-map-legend__dot')).toHaveAttribute('aria-hidden', 'true')
  })

  // A legend that only explains is not interactive; a button role would
  // promise an action the user cannot take and add a tab stop per row.
  it('renders a non-filtering row as a plain element, not a button', () => {
    const { container } = render(MapLegend, { props: { items: ITEMS } })
    expect(container.querySelector('button')).toBeNull()
  })

  it('renders a filtering row as a button', () => {
    const { container } = render(MapLegend, {
      props: { items: [{ ...ITEMS[0], selectable: true }] },
    })
    const btn = container.querySelector('.strand-map-legend__item') as HTMLElement
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveAttribute('type', 'button')
  })

  it('takes a custom title', () => {
    const { container } = render(MapLegend, { props: { items: ITEMS, title: 'Sectors' } })
    expect(container.querySelector('.strand-map-legend__title')?.textContent?.trim()).toBe('Sectors')
  })
})
