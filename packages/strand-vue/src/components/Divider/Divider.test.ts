import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Divider from './Divider.vue'

describe('Divider', () => {
  // ── Horizontal (default) ──

  it('renders an hr element by default', () => {
    const { container } = render(Divider)
    expect(container.firstElementChild?.tagName).toBe('HR')
  })

  it('applies horizontal class by default', () => {
    const { container } = render(Divider)
    expect(container.firstElementChild?.className).toContain('strand-divider--horizontal')
  })

  it('has separator role', () => {
    const { container } = render(Divider)
    expect(container.firstElementChild?.getAttribute('role')).toBe('separator')
  })

  it('has horizontal aria-orientation by default', () => {
    const { container } = render(Divider)
    expect(container.firstElementChild?.getAttribute('aria-orientation')).toBe('horizontal')
  })

  // ── Vertical ──

  it('renders a div for vertical direction', () => {
    const { container } = render(Divider, { props: { direction: 'vertical' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('applies vertical class', () => {
    const { container } = render(Divider, { props: { direction: 'vertical' } })
    expect(container.firstElementChild?.className).toContain('strand-divider--vertical')
  })

  it('has vertical aria-orientation', () => {
    const { container } = render(Divider, { props: { direction: 'vertical' } })
    expect(container.firstElementChild?.getAttribute('aria-orientation')).toBe('vertical')
  })

  // ── Labeled ──

  it('renders a div with label spans for labeled variant', () => {
    const { container } = render(Divider, { props: { label: 'OR' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('applies labeled class when label is provided', () => {
    const { container } = render(Divider, { props: { label: 'OR' } })
    expect(container.firstElementChild?.className).toContain('strand-divider--labeled')
  })

  it('renders label text', () => {
    const { container } = render(Divider, { props: { label: 'OR' } })
    const label = container.querySelector('.strand-divider__label')
    expect(label?.textContent).toBe('OR')
  })

  it('renders two line spans for labeled variant', () => {
    const { container } = render(Divider, { props: { label: 'OR' } })
    const lines = container.querySelectorAll('.strand-divider__line')
    expect(lines.length).toBe(2)
  })

  // ── Custom className ──

  it('merges custom className on horizontal', () => {
    const { container } = render(Divider, { props: { className: 'custom' } })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-divider')
    expect(el?.className).toContain('custom')
  })

  it('merges custom className on vertical', () => {
    const { container } = render(Divider, {
      props: { direction: 'vertical', className: 'custom' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-divider')
    expect(el?.className).toContain('custom')
  })

  it('merges custom className on labeled', () => {
    const { container } = render(Divider, {
      props: { label: 'OR', className: 'custom' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-divider')
    expect(el?.className).toContain('custom')
  })
})
