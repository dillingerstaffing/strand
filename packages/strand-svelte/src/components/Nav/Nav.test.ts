/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Nav from './Nav.svelte'

const testItems = [
  { label: 'Home', href: '/', active: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

describe('Nav', () => {
  it('renders with nav element and aria-label', () => {
    const { container } = render(Nav, { props: { items: testItems } })
    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('strand-nav')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('renders navigation items', () => {
    const { container } = render(Nav, { props: { items: testItems } })
    const links = container.querySelectorAll('.strand-nav__link')
    expect(links.length).toBe(3)
    expect(links[0]).toHaveTextContent('Home')
    expect(links[0]).toHaveAttribute('href', '/')
  })

  it('marks active item with class and aria-current', () => {
    const { container } = render(Nav, { props: { items: testItems } })
    const links = container.querySelectorAll('.strand-nav__link')
    expect(links[0]).toHaveClass('strand-nav__link--active')
    expect(links[0]).toHaveAttribute('aria-current', 'page')
    expect(links[1]).not.toHaveClass('strand-nav__link--active')
    expect(links[1]).not.toHaveAttribute('aria-current')
  })

  it('has hamburger button', () => {
    const { container } = render(Nav, { props: { items: testItems } })
    const btn = container.querySelector('.strand-nav__hamburger')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).toHaveAttribute('aria-label', 'Menu')
  })

  it('toggles mobile menu on hamburger click', async () => {
    const { container } = render(Nav, { props: { items: testItems } })
    const btn = container.querySelector('.strand-nav__hamburger')!
    expect(container.querySelector('.strand-nav__mobile-menu')).not.toBeInTheDocument()
    await fireEvent.click(btn)
    expect(container.querySelector('.strand-nav__mobile-menu')).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(btn).toHaveAttribute('aria-label', 'Close menu')
  })

  it('renders mobile links when menu is open', async () => {
    const { container } = render(Nav, { props: { items: testItems } })
    await fireEvent.click(container.querySelector('.strand-nav__hamburger')!)
    const mobileLinks = container.querySelectorAll('.strand-nav__mobile-link')
    expect(mobileLinks.length).toBe(3)
    expect(mobileLinks[0]).toHaveClass('strand-nav__mobile-link--active')
  })

  it('has hamburger icon with aria-hidden', () => {
    const { container } = render(Nav, { props: { items: testItems } })
    const icon = container.querySelector('.strand-nav__hamburger-icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('has inner wrapper', () => {
    const { container } = render(Nav, { props: { items: testItems } })
    expect(container.querySelector('.strand-nav__inner')).toBeInTheDocument()
  })

  it('applies glass class', () => {
    const { container } = render(Nav, { props: { items: testItems, glass: true } })
    expect(container.querySelector('.strand-nav')).toHaveClass('strand-nav--glass')
  })
})
