/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Breadcrumb from './Breadcrumb.svelte'

const testItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Widget' },
]

describe('Breadcrumb', () => {
  it('renders with nav and aria-label', () => {
    const { container } = render(Breadcrumb, { props: { items: testItems } })
    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    expect(nav).toHaveClass('strand-breadcrumb')
  })

  it('renders items as list', () => {
    const { container } = render(Breadcrumb, { props: { items: testItems } })
    const list = container.querySelector('.strand-breadcrumb__list')
    expect(list).toBeInTheDocument()
    const items = container.querySelectorAll('.strand-breadcrumb__item')
    expect(items.length).toBe(3)
  })

  it('renders links for non-last items', () => {
    const { container } = render(Breadcrumb, { props: { items: testItems } })
    const links = container.querySelectorAll('.strand-breadcrumb__link')
    expect(links.length).toBe(2)
    expect(links[0]).toHaveAttribute('href', '/')
    expect(links[0]).toHaveTextContent('Home')
  })

  it('renders last item as current page', () => {
    const { container } = render(Breadcrumb, { props: { items: testItems } })
    const current = container.querySelector('.strand-breadcrumb__current')
    expect(current).toBeInTheDocument()
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current).toHaveTextContent('Widget')
  })

  it('shows separators between items', () => {
    const { container } = render(Breadcrumb, { props: { items: testItems } })
    const seps = container.querySelectorAll('.strand-breadcrumb__separator')
    expect(seps.length).toBe(2)
    expect(seps[0]).toHaveAttribute('aria-hidden', 'true')
    expect(seps[0]).toHaveTextContent('/')
  })

  it('uses custom separator', () => {
    const { container } = render(Breadcrumb, { props: { items: testItems, separator: '>' } })
    const seps = container.querySelectorAll('.strand-breadcrumb__separator')
    expect(seps[0]).toHaveTextContent('>')
  })

  it('does not show separator before first item', () => {
    const { container } = render(Breadcrumb, { props: { items: testItems } })
    const firstItem = container.querySelector('.strand-breadcrumb__item')!
    const sep = firstItem.querySelector('.strand-breadcrumb__separator')
    expect(sep).not.toBeInTheDocument()
  })
})
