/*! Strand vue | MIT License | dillingerstaffing.com */
// Mirrors the canonical Preact assertions so the ports cannot drift.
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import ResultCard from './ResultCard.vue'

describe('ResultCard', () => {
  it('renders the title and the optional lines', () => {
    const { container } = render(ResultCard, {
      props: { title: 'Systems Engineer', company: 'Acme', location: 'Oakland', salary: '$120k' },
    })
    expect(container.querySelector('.strand-result-card__title')?.textContent?.trim()).toBe('Systems Engineer')
    expect(container.querySelector('.strand-result-card__company')?.textContent?.trim()).toBe('Acme')
  })

  // An empty styled row would take vertical space and draw a border for
  // nothing, in a panel where every row competes for height.
  it('omits the meta row entirely when there is no metadata', () => {
    const { container } = render(ResultCard, { props: { title: 'Bare' } })
    expect(container.querySelector('.strand-result-card__meta')).toBeNull()
    expect(container.querySelector('.strand-result-card__company')).toBeNull()
  })

  it('renders badges with their variant tint', () => {
    const { container } = render(ResultCard, {
      props: { title: 'x', badges: [{ label: 'Remote', variant: 'remote' }, { label: 'Feed' }] },
    })
    const badges = container.querySelectorAll('.strand-result-card__badge')
    expect(badges).toHaveLength(2)
    expect(badges[0].classList.contains('strand-result-card__badge--remote')).toBe(true)
    // No variant means the base class only, never a --undefined modifier
    // that matches no rule.
    expect(badges[1].className).toBe('strand-result-card__badge')
  })

  // A card that pans a map is a control and owes the keyboard the same
  // affordance as the mouse; a card that only displays is not.
  it('is an article when it does nothing', () => {
    const { container } = render(ResultCard, { props: { title: 'x' } })
    expect(container.querySelector('.strand-result-card')?.tagName).toBe('ARTICLE')
  })

  it('is a button when it is selectable', () => {
    const { container } = render(ResultCard, { props: { title: 'x', selectable: true } })
    const el = container.querySelector('.strand-result-card') as HTMLElement
    expect(el.tagName).toBe('BUTTON')
    expect(el).toHaveAttribute('type', 'button')
  })

  it('announces the highlighted result rather than only tinting it', () => {
    const { container } = render(ResultCard, { props: { title: 'x', active: true } })
    const el = container.querySelector('.strand-result-card')
    expect(el?.classList.contains('strand-result-card--active')).toBe(true)
    expect(el).toHaveAttribute('aria-current', 'true')
  })

  it('omits aria-current when it is not the active result', () => {
    const { container } = render(ResultCard, { props: { title: 'x' } })
    expect(container.querySelector('.strand-result-card')?.hasAttribute('aria-current')).toBe(false)
  })
})
