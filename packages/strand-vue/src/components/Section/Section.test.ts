import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Section from './Section.vue'

describe('Section', () => {
  // ── Rendering ──

  it('renders a section element', () => {
    const { container } = render(Section, { slots: { default: 'Content' } })
    expect(container.firstElementChild?.tagName).toBe('SECTION')
  })

  it('renders slot content', () => {
    const { getByText } = render(Section, { slots: { default: 'Hello' } })
    expect(getByText('Hello')).toBeTruthy()
  })

  // ── Variants ──

  it('applies standard variant class by default', () => {
    const { container } = render(Section, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-section--standard')
  })

  it('applies hero variant class', () => {
    const { container } = render(Section, {
      props: { variant: 'hero' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-section--hero')
  })

  // ── Background ──

  it('applies primary background class by default', () => {
    const { container } = render(Section, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-section--bg-primary')
  })

  it('applies elevated background class', () => {
    const { container } = render(Section, {
      props: { background: 'elevated' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-section--bg-elevated')
  })

  it('applies recessed background class', () => {
    const { container } = render(Section, {
      props: { background: 'recessed' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-section--bg-recessed')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Section, {
      props: { className: 'custom' },
      slots: { default: 'Test' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-section')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(Section, {
      attrs: { id: 'hero-section' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('hero-section')
  })
})
