/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import KvEditorial from './KvEditorial.svelte'

describe('KvEditorial', () => {
  it('renders base + --editorial classes', () => {
    const { container } = render(KvEditorial, {
      props: { label: 'A', value: 'B' },
    })
    const el = container.querySelector('.strand-kv')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-kv--editorial')
  })

  it('renders label and value', () => {
    const { getByText } = render(KvEditorial, {
      props: { label: 'Owner', value: 'DS' },
    })
    expect(getByText('Owner')).toBeInTheDocument()
    expect(getByText('DS')).toBeInTheDocument()
  })

  it('applies --status modifier when status is true', () => {
    const { container } = render(KvEditorial, {
      props: { label: 'A', value: 'B', status: true },
    })
    const valueEl = container.querySelector('.strand-kv__value')
    expect(valueEl).toHaveClass('strand-kv__value--status')
  })
})
