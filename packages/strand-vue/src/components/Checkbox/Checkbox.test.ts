/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
  it('renders with default props', () => {
    const { container } = render(Checkbox)
    const label = container.querySelector('.strand-checkbox')
    expect(label).toBeInTheDocument()
    const input = container.querySelector('.strand-checkbox__native') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'checkbox')
    expect(input).toHaveAttribute('role', 'checkbox')
    expect(input).toHaveAttribute('aria-checked', 'false')
    expect(input).not.toBeChecked()
  })

  it('applies checked state and class', () => {
    const { container } = render(Checkbox, {
      props: { checked: true },
    })
    const wrapper = container.querySelector('.strand-checkbox')
    expect(wrapper).toHaveClass('strand-checkbox--checked')
    const input = container.querySelector('.strand-checkbox__native') as HTMLInputElement
    expect(input).toBeChecked()
    expect(input).toHaveAttribute('aria-checked', 'true')
  })

  it('shows checkmark SVG when checked', () => {
    const { container } = render(Checkbox, {
      props: { checked: true },
    })
    const svg = container.querySelector('.strand-checkbox__icon')
    expect(svg).toBeInTheDocument()
    expect(container.querySelector('path')).toBeInTheDocument()
  })

  it('shows indeterminate state with mixed aria-checked', () => {
    const { container } = render(Checkbox, {
      props: { indeterminate: true },
    })
    const wrapper = container.querySelector('.strand-checkbox')
    expect(wrapper).toHaveClass('strand-checkbox--indeterminate')
    const input = container.querySelector('.strand-checkbox__native') as HTMLInputElement
    expect(input).toHaveAttribute('aria-checked', 'mixed')
  })

  it('shows dash SVG when indeterminate', () => {
    const { container } = render(Checkbox, {
      props: { indeterminate: true },
    })
    const svg = container.querySelector('.strand-checkbox__icon')
    expect(svg).toBeInTheDocument()
    expect(container.querySelector('line')).toBeInTheDocument()
  })

  it('does not show SVG when unchecked and not indeterminate', () => {
    const { container } = render(Checkbox)
    expect(container.querySelector('.strand-checkbox__icon')).not.toBeInTheDocument()
  })

  it('applies disabled state', () => {
    const { container } = render(Checkbox, {
      props: { disabled: true },
    })
    const wrapper = container.querySelector('.strand-checkbox')
    expect(wrapper).toHaveClass('strand-checkbox--disabled')
    const input = container.querySelector('.strand-checkbox__native')
    expect(input).toBeDisabled()
  })

  it('renders label text', () => {
    const { container } = render(Checkbox, {
      props: { label: 'Accept terms' },
    })
    const labelSpan = container.querySelector('.strand-checkbox__label')
    expect(labelSpan).toBeInTheDocument()
    expect(labelSpan).toHaveTextContent('Accept terms')
  })

  it('does not render label span without label prop', () => {
    const { container } = render(Checkbox)
    expect(container.querySelector('.strand-checkbox__label')).not.toBeInTheDocument()
  })

  it('emits change event when clicked', async () => {
    const { container, emitted } = render(Checkbox)
    const input = container.querySelector('.strand-checkbox__native') as HTMLInputElement
    await fireEvent.click(input)
    expect(emitted().change).toHaveLength(1)
  })

  it('does not emit change when disabled', async () => {
    const { container, emitted } = render(Checkbox, {
      props: { disabled: true },
    })
    const input = container.querySelector('.strand-checkbox__native') as HTMLInputElement
    await fireEvent.click(input)
    expect(emitted().change).toBeUndefined()
  })

  it('renders custom control with aria-hidden', () => {
    const { container } = render(Checkbox)
    const control = container.querySelector('.strand-checkbox__control')
    expect(control).toBeInTheDocument()
    expect(control).toHaveAttribute('aria-hidden', 'true')
  })

  it('sets indeterminate property on the native input', () => {
    const { container } = render(Checkbox, {
      props: { indeterminate: true },
    })
    const input = container.querySelector('.strand-checkbox__native') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
  })
})
