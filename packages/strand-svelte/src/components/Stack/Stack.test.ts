/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Stack from './Stack.svelte'

describe('Stack', () => {
  it('renders with default classes', () => {
    const { container } = render(Stack)
    const el = container.querySelector('.strand-stack')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-stack--vertical')
  })

  it('applies direction class', () => {
    const { container } = render(Stack, { props: { direction: 'horizontal' } })
    expect(container.querySelector('.strand-stack')).toHaveClass('strand-stack--horizontal')
  })

  it('sets gap via inline style', () => {
    const { container } = render(Stack, { props: { gap: 6 } })
    const el = container.querySelector('.strand-stack') as HTMLElement
    expect(el.style.gap).toBe('var(--strand-space-6)')
  })

  it('applies align class when not stretch', () => {
    const { container } = render(Stack, { props: { align: 'center' } })
    expect(container.querySelector('.strand-stack')).toHaveClass('strand-stack--align-center')
  })

  it('does not apply align class for stretch (default)', () => {
    const { container } = render(Stack)
    const el = container.querySelector('.strand-stack')
    expect(el!.className).not.toContain('strand-stack--align')
  })

  it('applies justify class', () => {
    const { container } = render(Stack, { props: { justify: 'between' } })
    expect(container.querySelector('.strand-stack')).toHaveClass('strand-stack--justify-between')
  })

  it('applies wrap class', () => {
    const { container } = render(Stack, { props: { wrap: true } })
    expect(container.querySelector('.strand-stack')).toHaveClass('strand-stack--wrap')
  })

  it('an off-ladder gap renders a real rung instead of no gap at all (gap #122)', () => {
    // `gap={7}` wrote `var(--strand-space-7)`, an undefined token, and an
    // undefined custom property invalidates the WHOLE declaration: the result
    // was no gap, not a smaller one.
    const { container } = render(Stack, { props: { gap: 7 } })
    const el = container.querySelector('.strand-stack') as HTMLElement
    expect(el.getAttribute('style')).toContain('--strand-space-6')
    expect(el.getAttribute('style')).not.toContain('--strand-space-7')
  })

  it('an on-ladder gap is untouched, so no existing consumer moves', () => {
    const { container } = render(Stack, { props: { gap: 6 } })
    const el = container.querySelector('.strand-stack') as HTMLElement
    expect(el.getAttribute('style')).toContain('--strand-space-6')
  })

})
