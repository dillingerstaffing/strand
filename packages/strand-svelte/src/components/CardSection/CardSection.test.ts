/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import CardSection from './CardSection.svelte'

describe('CardSection', () => {
  it('renders with base class', () => {
    const { container } = render(CardSection)
    const el = container.querySelector('.strand-card__section')
    expect(el).toBeInTheDocument()
  })

  it('does not apply header modifier by default', () => {
    const { container } = render(CardSection)
    expect(container.querySelector('.strand-card__section')).not.toHaveClass(
      'strand-card__section--header',
    )
  })

  it('applies header modifier when header prop is true', () => {
    const { container } = render(CardSection, { props: { header: true } })
    expect(container.querySelector('.strand-card__section')).toHaveClass(
      'strand-card__section--header',
    )
  })
})
