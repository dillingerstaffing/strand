/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Progress from './Progress.svelte'

describe('Progress', () => {
  it('renders bar with default classes', () => {
    const { container } = render(Progress)
    const el = container.querySelector('.strand-progress')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-progress--bar', 'strand-progress--md')
    expect(el).toHaveAttribute('role', 'progressbar')
  })

  it('shows indeterminate when no value', () => {
    const { container } = render(Progress)
    expect(container.querySelector('.strand-progress')).toHaveClass('strand-progress--indeterminate')
  })

  it('shows determinate with value', () => {
    const { container } = render(Progress, { props: { value: 50 } })
    const el = container.querySelector('.strand-progress')
    expect(el).not.toHaveClass('strand-progress--indeterminate')
    expect(el).toHaveAttribute('aria-valuenow', '50')
  })

  it('sets fill width for determinate bar', () => {
    const { container } = render(Progress, { props: { value: 75 } })
    const fill = container.querySelector('.strand-progress__fill') as HTMLElement
    expect(fill.style.width).toBe('75%')
  })

  it('applies size classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    for (const size of sizes) {
      const { container, unmount } = render(Progress, { props: { size } })
      expect(container.querySelector('.strand-progress')).toHaveClass(`strand-progress--${size}`)
      unmount()
    }
  })

  it('renders ring variant with SVG', () => {
    const { container } = render(Progress, { props: { variant: 'ring', value: 50 } })
    const el = container.querySelector('.strand-progress')
    expect(el).toHaveClass('strand-progress--ring')
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelector('.strand-progress__track')).toBeInTheDocument()
    expect(container.querySelector('.strand-progress__fill')).toBeInTheDocument()
  })

  it('has aria-valuemin and aria-valuemax', () => {
    const { container } = render(Progress, { props: { value: 25 } })
    const el = container.querySelector('.strand-progress')
    expect(el).toHaveAttribute('aria-valuemin', '0')
    expect(el).toHaveAttribute('aria-valuemax', '100')
  })
})
