import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Link from './Link.vue'

describe('Link', () => {
  // ── Rendering ──

  it('renders an anchor element', () => {
    const { container } = render(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    })
    expect(container.firstElementChild?.tagName).toBe('A')
  })

  it('renders slot content', () => {
    const { getByText } = render(Link, {
      props: { href: '/about' },
      slots: { default: 'About Us' },
    })
    expect(getByText('About Us')).toBeTruthy()
  })

  it('applies strand-link base class', () => {
    const { container } = render(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    })
    expect(container.firstElementChild?.className).toContain('strand-link')
  })

  // ── Href ──

  it('sets href attribute', () => {
    const { container } = render(Link, {
      props: { href: '/contact' },
      slots: { default: 'Contact' },
    })
    expect(container.firstElementChild?.getAttribute('href')).toBe('/contact')
  })

  // ── External ──

  it('does not set target or rel by default', () => {
    const { container } = render(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    })
    const el = container.firstElementChild
    expect(el?.getAttribute('target')).toBeNull()
    expect(el?.getAttribute('rel')).toBeNull()
  })

  it('sets target _blank when external', () => {
    const { container } = render(Link, {
      props: { href: 'https://example.com', external: true },
      slots: { default: 'External' },
    })
    expect(container.firstElementChild?.getAttribute('target')).toBe('_blank')
  })

  it('sets rel noopener noreferrer when external', () => {
    const { container } = render(Link, {
      props: { href: 'https://example.com', external: true },
      slots: { default: 'External' },
    })
    expect(container.firstElementChild?.getAttribute('rel')).toBe('noopener noreferrer')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Link, {
      props: { href: '/about', className: 'custom' },
      slots: { default: 'About' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-link')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(Link, {
      props: { href: '/about' },
      attrs: { id: 'my-link' },
      slots: { default: 'About' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('my-link')
  })
})
