/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Tooltip from './Tooltip.svelte'

describe('Tooltip', () => {
  it('renders wrapper with aria-describedby', () => {
    const { container } = render(Tooltip, { props: { content: 'Help text' } })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute('aria-describedby')
  })

  it('renders tooltip element with role', () => {
    const { container } = render(Tooltip, { props: { content: 'Help text' } })
    const tip = container.querySelector('[role="tooltip"]')
    expect(tip).toBeInTheDocument()
    expect(tip).toHaveTextContent('Help text')
    expect(tip).toHaveClass('strand-tooltip')
  })

  it('applies position class', () => {
    const positions = ['top', 'right', 'bottom', 'left'] as const
    for (const position of positions) {
      const { container, unmount } = render(Tooltip, { props: { content: 'Tip', position } })
      expect(container.querySelector('.strand-tooltip')).toHaveClass(`strand-tooltip--${position}`)
      unmount()
    }
  })

  it('is hidden by default', () => {
    const { container } = render(Tooltip, { props: { content: 'Tip' } })
    const tip = container.querySelector('.strand-tooltip')
    expect(tip).toHaveAttribute('aria-hidden', 'true')
    expect(tip).not.toHaveClass('strand-tooltip--visible')
  })

  it('tooltip id matches aria-describedby', () => {
    const { container } = render(Tooltip, { props: { content: 'Tip' } })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')
    const tip = container.querySelector('[role="tooltip"]')
    expect(wrapper!.getAttribute('aria-describedby')).toBe(tip!.id)
  })

  it('defaults to top position', () => {
    const { container } = render(Tooltip, { props: { content: 'Tip' } })
    expect(container.querySelector('.strand-tooltip')).toHaveClass('strand-tooltip--top')
  })
})
