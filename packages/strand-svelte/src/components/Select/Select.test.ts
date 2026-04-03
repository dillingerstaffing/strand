/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Select from './Select.svelte'

const testOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('Select', () => {
  it('renders with default classes', () => {
    const { container } = render(Select, { props: { options: testOptions } })
    expect(container.querySelector('.strand-select')).toBeInTheDocument()
    expect(container.querySelector('.strand-select__field')).toBeInTheDocument()
  })

  it('renders options', () => {
    const { container } = render(Select, { props: { options: testOptions } })
    const optionEls = container.querySelectorAll('option')
    expect(optionEls.length).toBe(3)
    expect(optionEls[0]).toHaveTextContent('Option A')
    expect(optionEls[1]).toHaveTextContent('Option B')
  })

  it('renders placeholder as disabled option', () => {
    const { container } = render(Select, { props: { options: testOptions, placeholder: 'Choose...' } })
    const optionEls = container.querySelectorAll('option')
    expect(optionEls.length).toBe(4)
    expect(optionEls[0]).toHaveTextContent('Choose...')
    expect(optionEls[0]).toBeDisabled()
  })

  it('applies error class and aria-invalid', () => {
    const { container } = render(Select, { props: { options: testOptions, error: true } })
    expect(container.querySelector('.strand-select')).toHaveClass('strand-select--error')
    expect(container.querySelector('.strand-select__field')).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Select, { props: { options: testOptions, disabled: true } })
    expect(container.querySelector('.strand-select')).toHaveClass('strand-select--disabled')
    expect(container.querySelector('.strand-select__field')).toBeDisabled()
  })

  it('has arrow indicator with aria-hidden', () => {
    const { container } = render(Select, { props: { options: testOptions } })
    const arrow = container.querySelector('.strand-select__arrow')
    expect(arrow).toBeInTheDocument()
    expect(arrow).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not set aria-invalid when no error', () => {
    const { container } = render(Select, { props: { options: testOptions } })
    expect(container.querySelector('.strand-select__field')).not.toHaveAttribute('aria-invalid')
  })
})
