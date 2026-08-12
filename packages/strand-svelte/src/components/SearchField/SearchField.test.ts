/*! Strand Svelte | MIT License | dillingerstaffing.com */

// SearchField's GEOMETRY -- that the box occupies its final size in the first
// frame, and that the coarse-pointer floor reaches 44px -- belongs to the
// layout tier, which asserts it in real Chromium. jsdom does not lay out and
// does not resolve media queries, so nothing here tries to prove either.
//
// What IS testable here is the contract a consumer programs against: the
// landmark and the search semantics, the accessible name surviving a
// placeholder-only design, the variant class, the value channel, and that
// composing a class or an attribute does not silently drop the component's
// own. These mirror the canonical Preact assertions so the ports cannot drift
// without something going red.

import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import SearchField from './SearchField.svelte'

const fieldOf = (container: HTMLElement) =>
  container.querySelector('.strand-search-field') as HTMLElement
const inputOf = (container: HTMLElement) =>
  container.querySelector('.strand-search-field__input') as HTMLInputElement

describe('SearchField', () => {
  it('is a search landmark carrying a search input', () => {
    const { container } = render(SearchField)
    expect(fieldOf(container)).toHaveAttribute('role', 'search')
    expect(inputOf(container)).toHaveAttribute('type', 'search')
  })

  it('names the input even when the only visible affordance is a placeholder', () => {
    // A placeholder is a hint. It vanishes on the first keystroke and is not an
    // accessible name, so a field labelled only by one is announced unlabelled.
    const { container } = render(SearchField, {
      props: { placeholder: 'Search events' },
    })
    expect(inputOf(container)).toHaveAttribute('aria-label', 'Search')
    expect(inputOf(container)).toHaveAttribute('placeholder', 'Search events')
  })

  it('takes an explicit label when the default is not specific enough', () => {
    const { container } = render(SearchField, { props: { label: 'Search events' } })
    expect(inputOf(container)).toHaveAttribute('aria-label', 'Search events')
  })

  it('defaults to the fixed-width presentation', () => {
    const { container } = render(SearchField)
    expect(fieldOf(container).classList.contains('strand-search-field--full')).toBe(
      false,
    )
  })

  it('spans its container when asked', () => {
    const { container } = render(SearchField, { props: { variant: 'full' } })
    expect(fieldOf(container).classList.contains('strand-search-field--full')).toBe(
      true,
    )
  })

  it('reports every keystroke', async () => {
    // Asserted through the callback prop rather than by reading the instance:
    // Svelte 5 removed instance property access for bound props, so a test
    // reading component.value passes or fails for reasons unrelated to the
    // component. The callback is the contract a consumer actually programs
    // against when they are not binding.
    const onvaluechange = vi.fn()
    const { container } = render(SearchField, { props: { value: '', onvaluechange } })
    await fireEvent.input(inputOf(container), { target: { value: 'pottery' } })
    expect(onvaluechange).toHaveBeenCalledWith('pottery')
  })

  // This port is the one that got class merging wrong for ActionDock:
  // $$restProps spreads AFTER the class attribute and REPLACED the component's
  // own class outright, so a consumer adding one utility silently lost the
  // whole primitive. Pinned here at birth rather than found later.
  it('carries a consumer class on the wrapper without dropping its own', () => {
    const { container } = render(SearchField, {
      props: { class: 'strand-hide-below-md' },
    })
    expect(fieldOf(container).classList.contains('strand-hide-below-md')).toBe(true)
    expect(fieldOf(container).classList.contains('strand-search-field')).toBe(true)
  })

  it('passes arbitrary attributes through to the input, not the wrapper', () => {
    // A consumer's id must land on the control they focus and read, or every
    // getElementById(...).focus() becomes a silent no-op.
    const { container } = render(SearchField, {
      props: { id: 'q', name: 'query' },
    })
    expect(inputOf(container)).toHaveAttribute('id', 'q')
    expect(inputOf(container)).toHaveAttribute('name', 'query')
    expect(fieldOf(container).hasAttribute('id')).toBe(false)
  })

  it('withholds the clear control when there is no value to read', () => {
    const { container } = render(SearchField, { props: { clearable: true } })
    expect(container.querySelector('.strand-search-field__clear')).toBeNull()
  })

  it('hides the clear control while the field is empty', () => {
    const { container } = render(SearchField, {
      props: { clearable: true, value: '' },
    })
    const clear = container.querySelector('.strand-search-field__clear')
    expect(clear).not.toBeNull()
    expect(clear).toHaveAttribute('hidden')
  })

  it('shows and fires the clear control once there is a value', async () => {
    const onclear = vi.fn()
    const { container } = render(SearchField, {
      props: { clearable: true, value: 'chess', onclear },
    })
    const clear = container.querySelector(
      '.strand-search-field__clear',
    ) as HTMLButtonElement
    expect(clear.hasAttribute('hidden')).toBe(false)
    expect(clear).toHaveAttribute('aria-label', 'Clear search')
    await fireEvent.click(clear)
    expect(onclear).toHaveBeenCalledTimes(1)
  })

  it('hides its icons from the accessibility tree', () => {
    const { container } = render(SearchField, {
      props: { clearable: true, value: 'x' },
    })
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('focusable', 'false')
    }
  })
})
