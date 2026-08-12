/*! Strand Svelte | MIT License | dillingerstaffing.com */

// The POSITIONING is this primitive's real contract -- fixed to the viewport,
// in 14.8's easy band, clearing the safe-area inset -- and jsdom cannot lay
// out, so none of it is evaluable here. Those claims live in
// scripts/layout-check.mjs in real Chromium.
//
// These mirror the canonical Preact assertions so the ports cannot drift
// without something going red. The one that matters most is that the current
// destination's visual state and its announced state are the same attribute.

import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import TabBar from './TabBar.svelte'

const ITEMS = [
  { id: 'discover', label: 'Discover', href: '/discover' },
  { id: 'calendar', label: 'Calendar', href: '/calendar' },
  { id: 'people', label: 'People', href: '/people' },
]

describe('TabBar', () => {
  it('is a navigation landmark with an accessible name', () => {
    const { container } = render(TabBar, { props: { items: ITEMS } })
    const nav = container.querySelector('nav')
    expect(nav?.classList.contains('strand-tabbar')).toBe(true)
    expect(nav).toHaveAttribute('aria-label', 'Primary')
  })

  it('takes a specific landmark name when a page has more than one nav', () => {
    const { container } = render(TabBar, {
      props: { items: ITEMS, label: 'Sections' },
    })
    expect(container.querySelector('nav')).toHaveAttribute('aria-label', 'Sections')
  })

  it('renders one item per destination', () => {
    const { container } = render(TabBar, { props: { items: ITEMS } })
    expect(container.querySelectorAll('.strand-tabbar__item')).toHaveLength(3)
    expect(container.textContent).toContain('Discover')
  })

  it('marks the current destination with aria-current, which is also what styles it', () => {
    const { container } = render(TabBar, {
      props: { items: ITEMS, current: 'calendar' },
    })
    const marked = container.querySelectorAll('[aria-current="page"]')
    expect(marked).toHaveLength(1)
    expect(marked[0].textContent).toContain('Calendar')
  })

  it('marks nothing when the current id matches no destination', () => {
    const { container } = render(TabBar, {
      props: { items: ITEMS, current: 'nowhere' },
    })
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(0)
  })

  it('renders a destination with a href as a link', () => {
    const { container } = render(TabBar, { props: { items: ITEMS } })
    const items = container.querySelectorAll('.strand-tabbar__item')
    expect([...items].every((el) => el.tagName === 'A')).toBe(true)
    expect(items[0]).toHaveAttribute('href', '/discover')
  })

  it('falls back to a button only for a destination with no href', () => {
    const { container } = render(TabBar, {
      props: { items: [{ id: 'a', label: 'A' }, ...ITEMS] },
    })
    const items = container.querySelectorAll('.strand-tabbar__item')
    expect(items[0].tagName).toBe('BUTTON')
    expect(items[0]).toHaveAttribute('type', 'button')
    expect(items[1].tagName).toBe('A')
  })

  it('reports the destination that was activated', async () => {
    const onnavigate = vi.fn()
    const { container } = render(TabBar, { props: { items: ITEMS, onnavigate } })
    await fireEvent.click(container.querySelectorAll('.strand-tabbar__item')[2])
    expect(onnavigate).toHaveBeenCalledWith('people')
  })

  it('does not let a plain click also hard-navigate when a handler owns it', () => {
    const onnavigate = vi.fn()
    const { container } = render(TabBar, { props: { items: ITEMS, onnavigate } })
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    container.querySelectorAll('.strand-tabbar__item')[0].dispatchEvent(event)
    expect(onnavigate).toHaveBeenCalledWith('discover')
    expect(event.defaultPrevented).toBe(true)
  })

  it('leaves a modified click to the browser and does not fire onnavigate', () => {
    const onnavigate = vi.fn()
    const { container } = render(TabBar, { props: { items: ITEMS, onnavigate } })
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      metaKey: true,
    })
    container.querySelectorAll('.strand-tabbar__item')[0].dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(onnavigate).not.toHaveBeenCalled()
  })

  // This port is the one that got class merging wrong for ActionDock, where
  // $$restProps spreads AFTER the class attribute and replaced it outright.
  // Losing the class here would strip the fixed positioning and drop the bar
  // into the document flow. Pinned at birth rather than found later.
  it('carries a consumer class without dropping its own', () => {
    const { container } = render(TabBar, {
      props: { items: ITEMS, class: 'strand-hide-from-md' },
    })
    const nav = container.querySelector('nav')
    expect(nav?.classList.contains('strand-hide-from-md')).toBe(true)
    expect(nav?.classList.contains('strand-tabbar')).toBe(true)
  })

  it('renders nothing but the landmark when there are no destinations', () => {
    const { container } = render(TabBar, { props: { items: [] } })
    expect(container.querySelector('nav')).not.toBeNull()
    expect(container.querySelectorAll('.strand-tabbar__item')).toHaveLength(0)
  })

  it('passes arbitrary attributes through to the landmark', () => {
    const { container } = render(TabBar, {
      props: { items: ITEMS, 'data-testid': 'shell-nav' },
    })
    expect(container.querySelector('nav')).toHaveAttribute('data-testid', 'shell-nav')
  })
})
