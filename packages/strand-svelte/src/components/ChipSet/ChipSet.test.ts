/*! Strand svelte | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import ChipSet from './ChipSet.svelte'

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
})
