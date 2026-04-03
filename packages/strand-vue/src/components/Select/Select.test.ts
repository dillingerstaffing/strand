/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Select from './Select.vue'

const defaultOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('Select', () => {
  it('renders with default props', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions },
    })
    const wrapper = container.querySelector('.strand-select')
    expect(wrapper).toBeInTheDocument()
    const select = container.querySelector('.strand-select__field') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select).not.toBeDisabled()
  })

  it('renders all options', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions },
    })
    const options = container.querySelectorAll('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('Option A')
    expect(options[0]).toHaveAttribute('value', 'a')
    expect(options[1]).toHaveTextContent('Option B')
    expect(options[2]).toHaveTextContent('Option C')
  })

  it('renders placeholder as first disabled option', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions, placeholder: 'Choose one' },
    })
    const options = container.querySelectorAll('option')
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveTextContent('Choose one')
    expect(options[0]).toHaveAttribute('value', '')
    expect(options[0]).toBeDisabled()
  })

  it('applies error class and aria-invalid', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions, error: true },
    })
    const wrapper = container.querySelector('.strand-select')
    expect(wrapper).toHaveClass('strand-select--error')
    const select = container.querySelector('.strand-select__field')
    expect(select).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid when no error', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions },
    })
    const select = container.querySelector('.strand-select__field')
    expect(select).not.toHaveAttribute('aria-invalid')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions, disabled: true },
    })
    const wrapper = container.querySelector('.strand-select')
    expect(wrapper).toHaveClass('strand-select--disabled')
    const select = container.querySelector('.strand-select__field')
    expect(select).toBeDisabled()
  })

  it('renders arrow indicator with aria-hidden', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions },
    })
    const arrow = container.querySelector('.strand-select__arrow')
    expect(arrow).toBeInTheDocument()
    expect(arrow).toHaveAttribute('aria-hidden', 'true')
  })

  it('emits update:modelValue on change', async () => {
    const { container, emitted } = render(Select, {
      props: { options: defaultOptions, modelValue: 'a' },
    })
    const select = container.querySelector('.strand-select__field') as HTMLSelectElement
    await fireEvent.update(select, 'b')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['b'])
  })

  it('sets selected value from modelValue', () => {
    const { container } = render(Select, {
      props: { options: defaultOptions, modelValue: 'b' },
    })
    const select = container.querySelector('.strand-select__field') as HTMLSelectElement
    expect(select.value).toBe('b')
  })
})
