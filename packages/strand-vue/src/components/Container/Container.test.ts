import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Container from './Container.vue'

describe('Container', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(Container, { slots: { default: 'Content' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders slot content', () => {
    const { getByText } = render(Container, { slots: { default: 'Hello' } })
    expect(getByText('Hello')).toBeTruthy()
  })

  // ── Sizes ──

  it('applies default size class by default', () => {
    const { container } = render(Container, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-container--default')
  })

  it('applies narrow size class', () => {
    const { container } = render(Container, {
      props: { size: 'narrow' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-container--narrow')
  })

  it('applies wide size class', () => {
    const { container } = render(Container, {
      props: { size: 'wide' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-container--wide')
  })

  it('applies full size class', () => {
    const { container } = render(Container, {
      props: { size: 'full' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-container--full')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Container, {
      props: { className: 'custom' },
      slots: { default: 'Test' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-container')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(Container, {
      attrs: { id: 'main-container' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('main-container')
  })
})
