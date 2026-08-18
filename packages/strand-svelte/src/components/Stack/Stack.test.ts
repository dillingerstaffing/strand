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

  it('sets the gap as a ladder class, never an inline style', () => {
    const { container } = render(Stack, { props: { gap: 6 } })
    const el = container.querySelector('.strand-stack') as HTMLElement
    expect(el).toHaveClass('strand-stack--gap-6')
    expect(el.getAttribute('style')).toBeNull()
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
    const { container } = render(Stack, { props: { gap: 7 } })
    const el = container.querySelector('.strand-stack') as HTMLElement
    expect(el).toHaveClass('strand-stack--gap-6')
    expect(el.className).not.toContain('gap-7')
  })

  it('an on-ladder gap is untouched, so no existing consumer moves', () => {
    const { container } = render(Stack, { props: { gap: 6 } })
    expect(container.querySelector('.strand-stack')).toHaveClass('strand-stack--gap-6')
  })

})
