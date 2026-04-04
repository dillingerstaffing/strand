/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import DataReadout from './DataReadout.svelte'

describe('DataReadout', () => {
  it('renders label and value', () => {
    const { container } = render(DataReadout, { props: { label: 'Revenue', value: '$1.2M' } })
    expect(container.querySelector('.strand-data-readout')).toBeInTheDocument()
    expect(container.querySelector('.strand-data-readout__label')).toHaveTextContent('Revenue')
    expect(container.querySelector('.strand-data-readout__value')).toHaveTextContent('$1.2M')
  })

  it('renders numeric value', () => {
    const { container } = render(DataReadout, { props: { label: 'Count', value: 42 } })
    expect(container.querySelector('.strand-data-readout__value')).toHaveTextContent('42')
  })

  it('applies sm size class', () => {
    const { container } = render(DataReadout, { props: { label: 'L', value: 'V', size: 'sm' } })
    expect(container.querySelector('.strand-data-readout')).toHaveClass('strand-data-readout--sm')
  })

  it('applies lg size class', () => {
    const { container } = render(DataReadout, { props: { label: 'L', value: 'V', size: 'lg' } })
    expect(container.querySelector('.strand-data-readout')).toHaveClass('strand-data-readout--lg')
  })

  it('applies xl size class', () => {
    const { container } = render(DataReadout, { props: { label: 'L', value: 'V', size: 'xl' } })
    expect(container.querySelector('.strand-data-readout')).toHaveClass('strand-data-readout--xl')
  })

  it('does not apply size class for md', () => {
    const { container } = render(DataReadout, { props: { label: 'L', value: 'V', size: 'md' } })
    const el = container.querySelector('.strand-data-readout')
    expect(el!.className).not.toContain('strand-data-readout--md')
  })
})
