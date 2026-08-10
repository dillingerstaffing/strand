/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Reserve from './Reserve.svelte'

describe('Reserve', () => {
  // ── The space contract (design-language.md 6.6.1) ──

  it('renders both layers, so the region is never empty while waiting', () => {
    const { container } = render(Reserve)
    expect(container.querySelector('.strand-reserve__placeholder')).toBeInTheDocument()
    expect(container.querySelector('.strand-reserve__content')).toBeInTheDocument()
  })

  it('sets the reserved height for the base breakpoint', () => {
    const { container } = render(Reserve, { props: { height: '42px' } })
    const el = container.querySelector('.strand-reserve') as HTMLElement
    expect(el.style.getPropertyValue('--strand-reserve-h')).toBe('42px')
  })

  it('sets independent reserved heights per breakpoint', () => {
    const { container } = render(Reserve, {
      props: { height: '180px', heightMd: '120px', heightLg: '96px' },
    })
    const el = container.querySelector('.strand-reserve') as HTMLElement
    expect(el.style.getPropertyValue('--strand-reserve-h')).toBe('180px')
    expect(el.style.getPropertyValue('--strand-reserve-h-md')).toBe('120px')
    expect(el.style.getPropertyValue('--strand-reserve-h-lg')).toBe('96px')
  })

  it('emits no height variables when none are given', () => {
    const { container } = render(Reserve)
    const el = container.querySelector('.strand-reserve') as HTMLElement
    expect(el.style.getPropertyValue('--strand-reserve-h')).toBe('')
  })

  // ── State ──

  it('is pending by default', () => {
    const { container } = render(Reserve)
    expect(container.querySelector('.strand-reserve')).toHaveAttribute(
      'data-strand-reserve',
      'pending',
    )
  })

  it('flips to ready when the data arrives', () => {
    const { container } = render(Reserve, { props: { ready: true } })
    expect(container.querySelector('.strand-reserve')).toHaveAttribute(
      'data-strand-reserve',
      'ready',
    )
  })

  it('collapses when the answer arrived and there is nothing to show', () => {
    const { container } = render(Reserve, { props: { ready: true, empty: true } })
    expect(container.querySelector('.strand-reserve')).toHaveAttribute(
      'data-strand-reserve',
      'empty',
    )
  })

  // ── Accessibility ──

  it('hides the placeholder from assistive tech', () => {
    const { container } = render(Reserve)
    expect(container.querySelector('.strand-reserve__placeholder')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('never marks the content aria-hidden', () => {
    const { container } = render(Reserve, { props: { ready: true } })
    expect(
      container.querySelector('.strand-reserve__content')?.getAttribute('aria-hidden'),
    ).toBeNull()
  })
})
