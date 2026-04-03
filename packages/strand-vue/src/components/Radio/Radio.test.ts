/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Radio from './Radio.vue'

describe('Radio', () => {
  it('renders with default props', () => {
    const { container } = render(Radio)
    const label = container.querySelector('.strand-radio')
    expect(label).toBeInTheDocument()
    const input = container.querySelector('.strand-radio__native') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'radio')
    expect(input).not.toBeChecked()
  })

  it('applies checked state and class', () => {
    const { container } = render(Radio, {
      props: { checked: true },
    })
    const wrapper = container.querySelector('.strand-radio')
    expect(wrapper).toHaveClass('strand-radio--checked')
    const input = container.querySelector('.strand-radio__native') as HTMLInputElement
    expect(input).toBeChecked()
  })

  it('applies disabled state', () => {
    const { container } = render(Radio, {
      props: { disabled: true },
    })
    const wrapper = container.querySelector('.strand-radio')
    expect(wrapper).toHaveClass('strand-radio--disabled')
    const input = container.querySelector('.strand-radio__native')
    expect(input).toBeDisabled()
  })

  it('renders label text', () => {
    const { container } = render(Radio, {
      props: { label: 'Option 1' },
    })
    const labelSpan = container.querySelector('.strand-radio__label')
    expect(labelSpan).toBeInTheDocument()
    expect(labelSpan).toHaveTextContent('Option 1')
  })

  it('does not render label span without label prop', () => {
    const { container } = render(Radio)
    expect(container.querySelector('.strand-radio__label')).not.toBeInTheDocument()
  })

  it('passes name attribute', () => {
    const { container } = render(Radio, {
      props: { name: 'color' },
    })
    const input = container.querySelector('.strand-radio__native')
    expect(input).toHaveAttribute('name', 'color')
  })

  it('passes value attribute', () => {
    const { container } = render(Radio, {
      props: { value: 'red' },
    })
    const input = container.querySelector('.strand-radio__native')
    expect(input).toHaveAttribute('value', 'red')
  })

  it('renders control with dot and aria-hidden', () => {
    const { container } = render(Radio)
    const control = container.querySelector('.strand-radio__control')
    expect(control).toBeInTheDocument()
    expect(control).toHaveAttribute('aria-hidden', 'true')
    const dot = container.querySelector('.strand-radio__dot')
    expect(dot).toBeInTheDocument()
  })

  it('emits change event when clicked', async () => {
    const { container, emitted } = render(Radio)
    const input = container.querySelector('.strand-radio__native') as HTMLInputElement
    await fireEvent.click(input)
    expect(emitted().change).toHaveLength(1)
  })

  it('does not emit change when disabled', async () => {
    const { container, emitted } = render(Radio, {
      props: { disabled: true },
    })
    const input = container.querySelector('.strand-radio__native') as HTMLInputElement
    await fireEvent.click(input)
    expect(emitted().change).toBeUndefined()
  })
})
