/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Skeleton from './Skeleton.svelte'

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(Skeleton)
    const el = container.querySelector('.strand-skeleton')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-skeleton--text', 'strand-skeleton--shimmer')
    expect(el).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies variant classes', () => {
    const variants = ['text', 'rectangle', 'circle'] as const
    for (const variant of variants) {
      const { container, unmount } = render(Skeleton, { props: { variant } })
      expect(container.querySelector('.strand-skeleton')).toHaveClass(`strand-skeleton--${variant}`)
      unmount()
    }
  })

  it('defaults text variant to 100% width', () => {
    const { container } = render(Skeleton)
    const el = container.querySelector('.strand-skeleton') as HTMLElement
    expect(el.style.width).toBe('100%')
  })

  it('applies custom width and height', () => {
    const { container } = render(Skeleton, { props: { variant: 'rectangle', width: '200px', height: '100px' } })
    const el = container.querySelector('.strand-skeleton') as HTMLElement
    expect(el.style.width).toBe('200px')
    expect(el.style.height).toBe('100px')
  })

  it('circle variant sets height equal to width', () => {
    const { container } = render(Skeleton, { props: { variant: 'circle', width: '48px' } })
    const el = container.querySelector('.strand-skeleton') as HTMLElement
    expect(el.style.width).toBe('48px')
    expect(el.style.height).toBe('48px')
  })
})
