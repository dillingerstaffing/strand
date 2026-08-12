/*! Strand Vue | MIT License | dillingerstaffing.com */

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

import { describe, expect, it } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import SearchField from './SearchField.vue'

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
    const { container } = render(SearchField, {
      props: { label: 'Search events' },
    })
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

  it('reports every keystroke through v-model', async () => {
    const { container, emitted } = render(SearchField, {
      props: { modelValue: '' },
    })
    await fireEvent.update(inputOf(container), 'pottery')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['pottery'])
  })

  it('carries a consumer class on the wrapper without dropping its own', () => {
    // The wrapper is what a breakpoint utility must land on: hiding the input
    // alone would leave the field's border and background drawn.
    const { container } = render(SearchField, {
      props: { className: 'strand-hide-below-md' },
    })
    expect(fieldOf(container).classList.contains('strand-hide-below-md')).toBe(true)
    expect(fieldOf(container).classList.contains('strand-search-field')).toBe(true)
  })

  it('passes arbitrary attributes through to the input, not the wrapper', () => {
    // A consumer's id must land on the control they focus and read, or every
    // getElementById(...).focus() becomes a silent no-op.
    const { container } = render(SearchField, { attrs: { id: 'q', name: 'query' } })
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
      props: { clearable: true, modelValue: '' },
    })
    const clear = container.querySelector('.strand-search-field__clear')
    expect(clear).not.toBeNull()
    expect(clear).toHaveAttribute('hidden')
  })

  it('shows and fires the clear control once there is a value', async () => {
    const { container, emitted } = render(SearchField, {
      props: { clearable: true, modelValue: 'chess' },
    })
    const clear = container.querySelector(
      '.strand-search-field__clear',
    ) as HTMLButtonElement
    expect(clear.hasAttribute('hidden')).toBe(false)
    expect(clear).toHaveAttribute('aria-label', 'Clear search')
    await fireEvent.click(clear)
    expect(emitted().clear).toBeTruthy()
  })

  it('hides its icons from the accessibility tree', () => {
    const { container } = render(SearchField, {
      props: { clearable: true, modelValue: 'x' },
    })
    for (const svg of container.querySelectorAll('svg')) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('focusable', 'false')
    }
  })
})
