import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Card from './Card.vue'

describe('Card', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(Card, { slots: { default: 'Content' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders slot content', () => {
    const { getByText } = render(Card, { slots: { default: 'Hello world' } })
    expect(getByText('Hello world')).toBeTruthy()
  })

  // ── Variants ──

  it('applies elevated variant class by default', () => {
    const { container } = render(Card, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-card--elevated')
  })

  it('applies outlined variant class', () => {
    const { container } = render(Card, {
      props: { variant: 'outlined' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-card--outlined')
  })

  it('applies interactive variant class', () => {
    const { container } = render(Card, {
      props: { variant: 'interactive' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-card--interactive')
  })

  // ── Padding ──

  it('applies md padding class by default', () => {
    const { container } = render(Card, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-card--pad-md')
  })

  it('applies none padding class', () => {
    const { container } = render(Card, {
      props: { padding: 'none' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-card--pad-none')
  })

  it('applies sm padding class', () => {
    const { container } = render(Card, {
      props: { padding: 'sm' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-card--pad-sm')
  })

  it('applies lg padding class', () => {
    const { container } = render(Card, {
      props: { padding: 'lg' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-card--pad-lg')
  })

  // ── Custom className ──

  it('merges custom className with component classes', () => {
    const { container } = render(Card, {
      props: { className: 'custom' },
      slots: { default: 'Test' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-card')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(Card, {
      attrs: { id: 'card-1', 'data-testid': 'my-card' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('card-1')
  })
})
