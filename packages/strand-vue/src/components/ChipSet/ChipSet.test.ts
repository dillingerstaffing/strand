/*! Strand vue | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import ChipSet from './ChipSet.vue'

const ITEMS = [
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'making', label: 'Making' },
]

describe('ChipSet', () => {
  it('is a named group of chips', () => {
    const { container } = render(ChipSet, { props: { label: 'Interests', items: ITEMS } })
    const set = container.querySelector('.strand-chip-set')
    expect(set).toHaveAttribute('role', 'group')
    expect(set).toHaveAttribute('aria-label', 'Interests')
    expect(container.querySelectorAll('.strand-chip-set__chip')).toHaveLength(2)
  })

  // "Any of these" and "one of these" are different promises, and painting
  // them identically tells a screen reader nothing about which it is.
  it('uses a radiogroup for single-select and a group for multi', () => {
    const { container: s } = render(ChipSet, { props: { label: 'F', items: ITEMS, mode: 'single' } })
    expect(s.querySelector('.strand-chip-set')).toHaveAttribute('role', 'radiogroup')
    expect(s.querySelector('.strand-chip-set__chip')).toHaveAttribute('role', 'radio')
  })

  it('announces selection with the attribute that also styles it', () => {
    const { container } = render(ChipSet, {
      props: { label: 'I', items: ITEMS, selected: ['making'] },
    })
    const pressed = container.querySelectorAll('[aria-pressed="true"]')
    expect(pressed).toHaveLength(1)
    expect(pressed[0].textContent?.trim()).toBe('Making')
  })

  it('uses aria-checked in single-select, not aria-pressed', () => {
    const { container } = render(ChipSet, {
      props: { label: 'F', items: ITEMS, mode: 'single', selected: ['making'] },
    })
    expect(container.querySelectorAll('[aria-checked="true"]')).toHaveLength(1)
    expect(container.querySelectorAll('[aria-pressed]')).toHaveLength(0)
  })

  it('composes the scroll row when asked and wraps by default', () => {
    const { container: w } = render(ChipSet, { props: { label: 'I', items: ITEMS } })
    expect(w.querySelector('.strand-chip-set')?.classList.contains('strand-scroll-row')).toBe(false)
    const { container: s } = render(ChipSet, { props: { label: 'I', items: ITEMS, overflow: 'scroll' } })
    expect(s.querySelector('.strand-chip-set')?.classList.contains('strand-scroll-row')).toBe(true)
  })
  it('renders a compact strip when asked, and a default one otherwise', () => {
    const items = [{ id: 'a', label: 'Outdoors' }]
    const { container: sm } = render(ChipSet, { props: { items, label: 'F', size: 'sm' } })
    expect(sm.querySelector('.strand-chip-set')?.classList.contains('strand-chip-set--sm')).toBe(true)
    const { container: md } = render(ChipSet, { props: { items, label: 'F' } })
    expect(md.querySelector('.strand-chip-set')?.classList.contains('strand-chip-set--sm')).toBe(false)
  })

  it('in single-select, keeps only the selected chip in the tab order and moves the selection with the arrows', async () => {
    const items = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]
    const { getAllByRole, emitted } = render(ChipSet, { props: { label: 'Filter', mode: 'single', items, selected: ['b'] } })
    const chips = getAllByRole('radio')
    expect(chips.map((c) => c.tabIndex)).toEqual([-1, 0, -1])
    await fireEvent.keyDown(chips[1], { key: 'ArrowRight' })
    expect(emitted('selectionChange')?.at(-1)).toEqual([['c']])
    expect(document.activeElement).toBe(chips[2])
    await fireEvent.keyDown(chips[1], { key: 'Home' })
    expect(emitted('selectionChange')?.at(-1)).toEqual([['a']])
  })
})
