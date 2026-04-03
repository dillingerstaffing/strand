import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(Skeleton)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('has aria-hidden attribute', () => {
    const { container } = render(Skeleton)
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  // ── Variants ──

  it('applies text variant class by default', () => {
    const { container } = render(Skeleton)
    expect(container.firstElementChild?.className).toContain('strand-skeleton--text')
  })

  it('applies rectangle variant class', () => {
    const { container } = render(Skeleton, { props: { variant: 'rectangle' } })
    expect(container.firstElementChild?.className).toContain('strand-skeleton--rectangle')
  })

  it('applies circle variant class', () => {
    const { container } = render(Skeleton, { props: { variant: 'circle', width: '48px' } })
    expect(container.firstElementChild?.className).toContain('strand-skeleton--circle')
  })

  // ── Shimmer ──

  it('applies shimmer class', () => {
    const { container } = render(Skeleton)
    expect(container.firstElementChild?.className).toContain('strand-skeleton--shimmer')
  })

  // ── Dimensions ──

  it('sets width to 100% for text variant by default', () => {
    const { container } = render(Skeleton)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('100%')
  })

  it('uses custom width when provided', () => {
    const { container } = render(Skeleton, { props: { width: '200px' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('200px')
  })

  it('uses custom height when provided', () => {
    const { container } = render(Skeleton, { props: { height: '50px' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.height).toBe('50px')
  })

  it('sets height equal to width for circle variant', () => {
    const { container } = render(Skeleton, { props: { variant: 'circle', width: '48px' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('48px')
    expect(el.style.height).toBe('48px')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Skeleton, { props: { className: 'custom' } })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-skeleton')
    expect(el?.className).toContain('custom')
  })
})
