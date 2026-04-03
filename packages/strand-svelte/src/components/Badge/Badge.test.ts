/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Badge from './Badge.svelte'

describe('Badge', () => {
  it('renders with default classes (inline, no children)', () => {
    const { container } = render(Badge)
    const el = container.querySelector('.strand-badge')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-badge--inline')
  })

  it('shows count variant indicator', () => {
    const { container } = render(Badge, { props: { count: 5 } })
    const indicator = container.querySelector('.strand-badge__indicator')
    expect(indicator).toHaveClass('strand-badge--count')
    expect(indicator).toHaveTextContent('5')
  })

  it('caps count at maxCount', () => {
    const { container } = render(Badge, { props: { count: 150, maxCount: 99 } })
    const indicator = container.querySelector('.strand-badge__indicator')
    expect(indicator).toHaveTextContent('99+')
  })

  it('renders dot variant', () => {
    const { container } = render(Badge, { props: { variant: 'dot' } })
    const indicator = container.querySelector('.strand-badge__indicator')
    expect(indicator).toHaveClass('strand-badge--dot')
    expect(indicator).toHaveAttribute('aria-label', 'Status indicator')
  })

  it('applies status classes', () => {
    const statuses = ['default', 'teal', 'blue', 'amber', 'red'] as const
    for (const status of statuses) {
      const { container, unmount } = render(Badge, { props: { status } })
      expect(container.querySelector('.strand-badge__indicator')).toHaveClass(`strand-badge--${status}`)
      unmount()
    }
  })

  it('has role="status" on indicator', () => {
    const { container } = render(Badge, { props: { count: 3 } })
    const indicator = container.querySelector('.strand-badge__indicator')
    expect(indicator).toHaveAttribute('role', 'status')
  })

  it('sets notifications aria-label for count', () => {
    const { container } = render(Badge, { props: { count: 7 } })
    const indicator = container.querySelector('.strand-badge__indicator')
    expect(indicator).toHaveAttribute('aria-label', '7 notifications')
  })
})
