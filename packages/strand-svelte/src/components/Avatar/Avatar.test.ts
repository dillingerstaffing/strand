/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Avatar from './Avatar.svelte'

describe('Avatar', () => {
  it('renders with default classes', () => {
    const { container } = render(Avatar)
    const el = container.querySelector('.strand-avatar')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-avatar--md')
    expect(el).toHaveAttribute('role', 'img')
  })

  it('applies size classes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const
    for (const size of sizes) {
      const { container, unmount } = render(Avatar, { props: { size } })
      expect(container.querySelector('.strand-avatar')).toHaveClass(`strand-avatar--${size}`)
      unmount()
    }
  })

  it('shows initials when no src', () => {
    const { container } = render(Avatar, { props: { initials: 'AB' } })
    const span = container.querySelector('.strand-avatar__initials')
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent('AB')
    expect(span).toHaveAttribute('aria-hidden', 'true')
  })

  it('truncates initials to 2 characters', () => {
    const { container } = render(Avatar, { props: { initials: 'abc' } })
    expect(container.querySelector('.strand-avatar__initials')).toHaveTextContent('AB')
  })

  it('renders image when src is provided', () => {
    const { container } = render(Avatar, { props: { src: 'test.jpg', alt: 'Test' } })
    const img = container.querySelector('.strand-avatar__img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'test.jpg')
    expect(img).toHaveAttribute('alt', 'Test')
  })

  it('sets aria-label from alt text', () => {
    const { container } = render(Avatar, { props: { alt: 'User Name' } })
    expect(container.querySelector('.strand-avatar')).toHaveAttribute('aria-label', 'User Name')
  })

  it('sets aria-label from initials when no alt', () => {
    const { container } = render(Avatar, { props: { initials: 'JD' } })
    expect(container.querySelector('.strand-avatar')).toHaveAttribute('aria-label', 'JD')
  })
})
