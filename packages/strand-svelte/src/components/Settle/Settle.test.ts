/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Settle from './Settle.svelte'

// jsdom runs no animations, so nothing here asserts that anything faded --
// that claim belongs to `pnpm test:motion`. What IS assertable, and what
// consumers actually get wrong, is design-language 6.9.1: the fade fires
// because the framework REPLACES the element, so a changed `on` must produce
// a new node and an unchanged `on` must not.

describe('Settle', () => {
  it('carries the primitive class, so the CSS layer does the work', () => {
    const { container } = render(Settle)
    expect(container.querySelector('.strand-settle')).toBeInTheDocument()
  })

  it('renders as the element the caller asked for, so it can be used inline', () => {
    const { container } = render(Settle, { props: { as: 'span' } })
    expect(container.querySelector('span.strand-settle')).toBeInTheDocument()
  })

  it('keeps the consumer class alongside the primitive class', () => {
    const { container } = render(Settle, { props: { class: 'strand-kv__value' } })
    const el = container.querySelector('.strand-settle') as HTMLElement
    expect(el.className).toContain('strand-kv__value')
  })

  it('replaces the node when the value changes, which is what makes the fade fire', async () => {
    const { container, rerender } = render(Settle, { props: { as: 'span', on: 6 } })
    const before = container.querySelector('.strand-settle')
    await rerender({ as: 'span', on: 7 })
    expect(container.querySelector('.strand-settle')).not.toBe(before)
  })

  it('reuses the node when the value did not change, so nothing re-announces itself', async () => {
    const { container, rerender } = render(Settle, { props: { as: 'span', on: 6 } })
    const before = container.querySelector('.strand-settle')
    await rerender({ as: 'span', on: 6 })
    expect(container.querySelector('.strand-settle')).toBe(before)
  })

  it('emits no sizing, because Settle owns the moment and Reserve owns the box', () => {
    const { container } = render(Settle, { props: { on: 7 } })
    const el = container.querySelector('.strand-settle') as HTMLElement
    expect(el.getAttribute('style')).toBeNull()
  })
})
