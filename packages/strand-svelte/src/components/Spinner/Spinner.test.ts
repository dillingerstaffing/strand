/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Spinner from './Spinner.svelte'

describe('Spinner', () => {
  it('renders with default classes', () => {
    const { container } = render(Spinner)
    const el = container.querySelector('.strand-spinner')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-spinner--md')
    expect(el).toHaveAttribute('role', 'status')
  })

  it('applies size classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    for (const size of sizes) {
      const { container, unmount } = render(Spinner, { props: { size } })
      expect(container.querySelector('.strand-spinner')).toHaveClass(`strand-spinner--${size}`)
      unmount()
    }
  })

  it('has ring with aria-hidden', () => {
    const { container } = render(Spinner)
    const ring = container.querySelector('.strand-spinner__ring')
    expect(ring).toBeInTheDocument()
    expect(ring).toHaveAttribute('aria-hidden', 'true')
  })

  it('has screen reader text', () => {
    const { container } = render(Spinner)
    const srOnly = container.querySelector('.strand-spinner__sr-only')
    expect(srOnly).toBeInTheDocument()
    expect(srOnly).toHaveTextContent('Loading')
  })
})
