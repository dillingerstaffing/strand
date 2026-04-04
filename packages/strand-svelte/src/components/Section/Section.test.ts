/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Section from './Section.svelte'

describe('Section', () => {
  it('renders with default classes', () => {
    const { container } = render(Section)
    const el = container.querySelector('.strand-section')
    expect(el).toBeInTheDocument()
    expect(el!.tagName).toBe('SECTION')
    expect(el).toHaveClass('strand-section--standard', 'strand-section--bg-primary')
  })

  it('applies variant classes', () => {
    const { container } = render(Section, { props: { variant: 'hero' } })
    expect(container.querySelector('.strand-section')).toHaveClass('strand-section--hero')
  })

  it('applies compact variant class', () => {
    const { container } = render(Section, { props: { variant: 'compact' } })
    expect(container.querySelector('.strand-section')).toHaveClass('strand-section--compact')
  })

  it('applies border-top class', () => {
    const { container } = render(Section, { props: { borderTop: true } })
    expect(container.querySelector('.strand-section')).toHaveClass('strand-section--border-top')
  })

  it('applies background classes', () => {
    const backgrounds = ['primary', 'elevated', 'recessed'] as const
    for (const background of backgrounds) {
      const { container, unmount } = render(Section, { props: { background } })
      expect(container.querySelector('.strand-section')).toHaveClass(`strand-section--bg-${background}`)
      unmount()
    }
  })
})
