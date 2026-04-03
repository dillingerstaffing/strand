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
})
