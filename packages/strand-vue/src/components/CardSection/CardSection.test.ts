import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import CardSection from './CardSection.vue'

describe('CardSection', () => {
  it('renders a div element', () => {
    const { container } = render(CardSection, { slots: { default: 'Content' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders slot content', () => {
    const { getByText } = render(CardSection, { slots: { default: 'Hello world' } })
    expect(getByText('Hello world')).toBeTruthy()
  })

  it('applies the strand-card__section base class', () => {
    const { container } = render(CardSection, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-card__section')
  })

  it('does not apply --header modifier by default', () => {
    const { container } = render(CardSection, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).not.toContain('strand-card__section--header')
  })

  it('applies --header modifier when header prop is true', () => {
    const { container } = render(CardSection, {
      props: { header: true },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-card__section--header')
  })

  it('merges custom className', () => {
    const { container } = render(CardSection, {
      props: { className: 'custom' },
      slots: { default: 'Test' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-card__section')
    expect(el?.className).toContain('custom')
  })

  it('forwards additional attributes', () => {
    const { container } = render(CardSection, {
      attrs: { id: 's-1' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('s-1')
  })
})
