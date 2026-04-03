/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Card from './Card.svelte'

describe('Card', () => {
  it('renders with default classes', () => {
    const { container } = render(Card)
    const el = container.querySelector('.strand-card')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-card--elevated', 'strand-card--pad-md')
  })

  it('applies variant classes', () => {
    const variants = ['elevated', 'outlined', 'interactive'] as const
    for (const variant of variants) {
      const { container, unmount } = render(Card, { props: { variant } })
      expect(container.querySelector('.strand-card')).toHaveClass(`strand-card--${variant}`)
      unmount()
    }
  })

  it('applies padding classes', () => {
    const paddings = ['none', 'sm', 'md', 'lg'] as const
    for (const padding of paddings) {
      const { container, unmount } = render(Card, { props: { padding } })
      expect(container.querySelector('.strand-card')).toHaveClass(`strand-card--pad-${padding}`)
      unmount()
    }
  })
})
