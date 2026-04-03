/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Breadcrumb from './Breadcrumb.vue'

const defaultItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Widget' },
]

describe('Breadcrumb', () => {
  it('renders nav with aria-label', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems },
    })
    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    expect(nav).toHaveClass('strand-breadcrumb')
  })

  it('renders ordered list', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems },
    })
    const ol = container.querySelector('.strand-breadcrumb__list')
    expect(ol).toBeInTheDocument()
    expect(ol?.tagName).toBe('OL')
  })

  it('renders correct number of items', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems },
    })
    const items = container.querySelectorAll('.strand-breadcrumb__item')
    expect(items).toHaveLength(3)
  })

  it('renders links for non-last items', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems },
    })
    const links = container.querySelectorAll('.strand-breadcrumb__link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/')
    expect(links[0]).toHaveTextContent('Home')
    expect(links[1]).toHaveAttribute('href', '/products')
    expect(links[1]).toHaveTextContent('Products')
  })

  it('renders last item as current page with aria-current', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems },
    })
    const current = container.querySelector('.strand-breadcrumb__current')
    expect(current).toBeInTheDocument()
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current).toHaveTextContent('Widget')
  })

  it('renders separators between items with aria-hidden', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems },
    })
    const separators = container.querySelectorAll('.strand-breadcrumb__separator')
    expect(separators).toHaveLength(2)
    expect(separators[0]).toHaveAttribute('aria-hidden', 'true')
    expect(separators[0]).toHaveTextContent('/')
    expect(separators[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not render separator before first item', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems },
    })
    const firstItem = container.querySelector('.strand-breadcrumb__item')
    expect(firstItem?.querySelector('.strand-breadcrumb__separator')).not.toBeInTheDocument()
  })

  it('uses custom separator', () => {
    const { container } = render(Breadcrumb, {
      props: { items: defaultItems, separator: '>' },
    })
    const separators = container.querySelectorAll('.strand-breadcrumb__separator')
    expect(separators[0]).toHaveTextContent('>')
  })

  it('handles single item', () => {
    const { container } = render(Breadcrumb, {
      props: { items: [{ label: 'Home' }] },
    })
    const items = container.querySelectorAll('.strand-breadcrumb__item')
    expect(items).toHaveLength(1)
    const current = container.querySelector('.strand-breadcrumb__current')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(container.querySelector('.strand-breadcrumb__separator')).not.toBeInTheDocument()
    expect(container.querySelector('.strand-breadcrumb__link')).not.toBeInTheDocument()
  })

  it('handles two items', () => {
    const { container } = render(Breadcrumb, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'About' },
        ],
      },
    })
    const links = container.querySelectorAll('.strand-breadcrumb__link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveTextContent('Home')
    const current = container.querySelector('.strand-breadcrumb__current')
    expect(current).toHaveTextContent('About')
    const separators = container.querySelectorAll('.strand-breadcrumb__separator')
    expect(separators).toHaveLength(1)
  })
})
