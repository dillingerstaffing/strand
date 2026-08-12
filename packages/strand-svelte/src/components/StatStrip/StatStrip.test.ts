/*! Strand svelte | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import StatStrip from './StatStrip.svelte'

const ITEMS = [
  { label: 'Group', value: 'East Bay' },
  { label: 'Meet at', value: 'Skyline Gate' },
]

describe('StatStrip', () => {
  // A row of divs gives a screen reader four unrelated strings; a
  // description list gives it two pairs, which is what the row means.
  it('is a description list of term and description pairs', () => {
    const { container } = render(StatStrip, { props: { items: ITEMS } })
    expect(container.querySelector('.strand-stat-strip')?.tagName).toBe('DL')
    expect(container.querySelectorAll('dt')).toHaveLength(2)
    expect(container.querySelectorAll('dd')).toHaveLength(2)
  })

  it('groups each term with its own description', () => {
    const { container } = render(StatStrip, { props: { items: ITEMS } })
    const cells = container.querySelectorAll('.strand-stat-strip__cell')
    expect(cells[0].querySelector('dt')?.textContent?.trim()).toBe('Group')
    expect(cells[0].querySelector('dd')?.textContent?.trim()).toBe('East Bay')
  })

  it('takes the bordered density', () => {
    const { container } = render(StatStrip, { props: { items: ITEMS, variant: 'bordered' } })
    expect(container.querySelector('.strand-stat-strip')?.classList.contains('strand-stat-strip--bordered')).toBe(true)
  })

  it('renders nothing but the list when there are no items', () => {
    const { container } = render(StatStrip, { props: { items: [] } })
    expect(container.querySelector('.strand-stat-strip')).not.toBeNull()
    expect(container.querySelectorAll('.strand-stat-strip__cell')).toHaveLength(0)
  })
})
