import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(Avatar)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('has role img', () => {
    const { container } = render(Avatar)
    expect(container.firstElementChild?.getAttribute('role')).toBe('img')
  })

  // ── Image mode ──

  it('renders an img when src is provided', () => {
    const { container } = render(Avatar, {
      props: { src: 'https://example.com/photo.jpg', alt: 'User' },
    })
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('src')).toBe('https://example.com/photo.jpg')
  })

  it('applies strand-avatar__img class to image', () => {
    const { container } = render(Avatar, {
      props: { src: 'https://example.com/photo.jpg' },
    })
    expect(container.querySelector('.strand-avatar__img')).toBeTruthy()
  })

  // ── Initials mode ──

  it('renders initials when no src is provided', () => {
    const { container } = render(Avatar, { props: { initials: 'AB' } })
    const span = container.querySelector('.strand-avatar__initials')
    expect(span).toBeTruthy()
    expect(span?.textContent).toBe('AB')
  })

  it('truncates initials to 2 characters', () => {
    const { container } = render(Avatar, { props: { initials: 'ABC' } })
    const span = container.querySelector('.strand-avatar__initials')
    expect(span?.textContent).toBe('AB')
  })

  it('uppercases initials', () => {
    const { container } = render(Avatar, { props: { initials: 'ab' } })
    const span = container.querySelector('.strand-avatar__initials')
    expect(span?.textContent).toBe('AB')
  })

  it('marks initials as aria-hidden', () => {
    const { container } = render(Avatar, { props: { initials: 'AB' } })
    const span = container.querySelector('.strand-avatar__initials')
    expect(span?.getAttribute('aria-hidden')).toBe('true')
  })

  // ── Sizes ──

  it('applies md size class by default', () => {
    const { container } = render(Avatar)
    expect(container.firstElementChild?.className).toContain('strand-avatar--md')
  })

  it('applies sm size class', () => {
    const { container } = render(Avatar, { props: { size: 'sm' } })
    expect(container.firstElementChild?.className).toContain('strand-avatar--sm')
  })

  it('applies lg size class', () => {
    const { container } = render(Avatar, { props: { size: 'lg' } })
    expect(container.firstElementChild?.className).toContain('strand-avatar--lg')
  })

  it('applies xl size class', () => {
    const { container } = render(Avatar, { props: { size: 'xl' } })
    expect(container.firstElementChild?.className).toContain('strand-avatar--xl')
  })

  // ── Accessibility ──

  it('uses alt as aria-label when provided', () => {
    const { container } = render(Avatar, { props: { alt: 'Jane Doe' } })
    expect(container.firstElementChild?.getAttribute('aria-label')).toBe('Jane Doe')
  })

  it('uses initials as aria-label fallback', () => {
    const { container } = render(Avatar, { props: { initials: 'jd' } })
    expect(container.firstElementChild?.getAttribute('aria-label')).toBe('JD')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Avatar, { props: { className: 'custom' } })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-avatar')
    expect(el?.className).toContain('custom')
  })
})
