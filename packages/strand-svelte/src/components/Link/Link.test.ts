/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Link from './Link.svelte'

describe('Link', () => {
  it('renders with class and href', () => {
    const { container } = render(Link, { props: { href: '/test' } })
    const el = container.querySelector('.strand-link')
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('href', '/test')
  })

  it('does not set target or rel by default', () => {
    const { container } = render(Link, { props: { href: '/test' } })
    const el = container.querySelector('.strand-link')
    expect(el).not.toHaveAttribute('target')
    expect(el).not.toHaveAttribute('rel')
  })

  it('sets target and rel for external links', () => {
    const { container } = render(Link, { props: { href: 'https://example.com', external: true } })
    const el = container.querySelector('.strand-link')
    expect(el).toHaveAttribute('target', '_blank')
    expect(el).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
