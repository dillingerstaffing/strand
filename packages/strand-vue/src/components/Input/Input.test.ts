/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Input from './Input.vue'

describe('Input', () => {
  it('renders with default props', () => {
    const { container } = render(Input)
    const wrapper = container.querySelector('.strand-input')
    expect(wrapper).toBeInTheDocument()
    const input = container.querySelector('.strand-input__field') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
    expect(input).not.toBeDisabled()
  })

  it('applies error class and aria-invalid', () => {
    const { container } = render(Input, {
      props: { error: true },
    })
    const wrapper = container.querySelector('.strand-input')
    expect(wrapper).toHaveClass('strand-input--error')
    const input = container.querySelector('.strand-input__field')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid when no error', () => {
    const { container } = render(Input)
    const input = container.querySelector('.strand-input__field')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Input, {
      props: { disabled: true },
    })
    const wrapper = container.querySelector('.strand-input')
    expect(wrapper).toHaveClass('strand-input--disabled')
    const input = container.querySelector('.strand-input__field')
    expect(input).toBeDisabled()
  })

  it('sets input type', () => {
    const types = ['text', 'email', 'password', 'search', 'number'] as const
    for (const type of types) {
      const { container } = render(Input, {
        props: { type },
      })
      expect(container.querySelector('.strand-input__field')).toHaveAttribute('type', type)
    }
  })

  it('emits update:modelValue on input', async () => {
    const { container, emitted } = render(Input, {
      props: { modelValue: '' },
    })
    const input = container.querySelector('.strand-input__field') as HTMLInputElement
    await fireEvent.update(input, 'hello')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['hello'])
  })

  it('renders leading addon slot with has-leading class', () => {
    const { container } = render(Input, {
      slots: { leading: '<span>$</span>' },
    })
    const wrapper = container.querySelector('.strand-input')
    expect(wrapper).toHaveClass('strand-input--has-leading')
    const leading = container.querySelector('.strand-input__leading')
    expect(leading).toBeInTheDocument()
    expect(leading).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders trailing addon slot with has-trailing class', () => {
    const { container } = render(Input, {
      slots: { trailing: '<span>%</span>' },
    })
    const wrapper = container.querySelector('.strand-input')
    expect(wrapper).toHaveClass('strand-input--has-trailing')
    const trailing = container.querySelector('.strand-input__trailing')
    expect(trailing).toBeInTheDocument()
    expect(trailing).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not render addon containers when slots are empty', () => {
    const { container } = render(Input)
    expect(container.querySelector('.strand-input__leading')).not.toBeInTheDocument()
    expect(container.querySelector('.strand-input__trailing')).not.toBeInTheDocument()
    const wrapper = container.querySelector('.strand-input')
    expect(wrapper).not.toHaveClass('strand-input--has-leading')
    expect(wrapper).not.toHaveClass('strand-input--has-trailing')
  })

  it('passes modelValue to input value', () => {
    const { container } = render(Input, {
      props: { modelValue: 'test value' },
    })
    const input = container.querySelector('.strand-input__field') as HTMLInputElement
    expect(input.value).toBe('test value')
  })
})
