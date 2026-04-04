/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import InstrumentViewport from './InstrumentViewport.svelte'

describe('InstrumentViewport', () => {
  it('renders with base class', () => {
    const { container } = render(InstrumentViewport)
    const el = container.querySelector('.strand-instrument-viewport')
    expect(el).toBeInTheDocument()
  })

  it('does not apply grid modifier by default', () => {
    const { container } = render(InstrumentViewport)
    const el = container.querySelector('.strand-instrument-viewport')
    expect(el).not.toHaveClass('strand-instrument-viewport--grid')
  })

  it('applies grid modifier when grid prop is true', () => {
    const { container } = render(InstrumentViewport, { props: { grid: true } })
    const el = container.querySelector('.strand-instrument-viewport')
    expect(el).toHaveClass('strand-instrument-viewport--grid')
  })
})
