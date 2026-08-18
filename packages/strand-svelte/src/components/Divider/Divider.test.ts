/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Divider from './Divider.svelte'

describe('Divider', () => {
  it('renders horizontal hr by default', () => {
    const { container } = render(Divider)
    const el = container.querySelector('.strand-divider')
    expect(el).toBeInTheDocument()
    expect(el!.tagName).toBe('HR')
    expect(el).toHaveClass('strand-divider--horizontal')
  })

  it('fades out at both ends as the gradient variant, and takes markup for the label through the default slot', () => {
    const { container } = render(Divider, { props: { variant: 'gradient' } })
    expect(container.querySelector('.strand-divider')).toHaveClass('strand-divider--gradient')
  })

  it('renders vertical divider', () => {
    const { container } = render(Divider, { props: { direction: 'vertical' } })
    const el = container.querySelector('.strand-divider')
    expect(el).toHaveClass('strand-divider--vertical')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders labeled horizontal divider', () => {
    const { container } = render(Divider, { props: { label: 'OR' } })
    const el = container.querySelector('.strand-divider')
    expect(el).toHaveClass('strand-divider--labeled')
    expect(el!.tagName).toBe('DIV')
    expect(container.querySelector('.strand-divider__label')).toHaveTextContent('OR')
    const lines = container.querySelectorAll('.strand-divider__line')
    expect(lines.length).toBe(2)
  })
})
