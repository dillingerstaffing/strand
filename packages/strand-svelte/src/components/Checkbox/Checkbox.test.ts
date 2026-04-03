/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Checkbox from './Checkbox.svelte'

describe('Checkbox', () => {
  it('renders with default classes', () => {
    const { container } = render(Checkbox)
    expect(container.querySelector('.strand-checkbox')).toBeInTheDocument()
    const input = container.querySelector('.strand-checkbox__native')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'checkbox')
    expect(input).toHaveAttribute('role', 'checkbox')
  })

  it('applies checked class and aria-checked', () => {
    const { container } = render(Checkbox, { props: { checked: true } })
    expect(container.querySelector('.strand-checkbox')).toHaveClass('strand-checkbox--checked')
    expect(container.querySelector('.strand-checkbox__native')).toHaveAttribute('aria-checked', 'true')
  })

  it('shows checkmark icon when checked', () => {
    const { container } = render(Checkbox, { props: { checked: true } })
    expect(container.querySelector('.strand-checkbox__icon')).toBeInTheDocument()
  })

  it('applies indeterminate class and aria-checked mixed', () => {
    const { container } = render(Checkbox, { props: { indeterminate: true } })
    expect(container.querySelector('.strand-checkbox')).toHaveClass('strand-checkbox--indeterminate')
    expect(container.querySelector('.strand-checkbox__native')).toHaveAttribute('aria-checked', 'mixed')
  })

  it('shows indeterminate icon', () => {
    const { container } = render(Checkbox, { props: { indeterminate: true } })
    expect(container.querySelector('.strand-checkbox__icon')).toBeInTheDocument()
    expect(container.querySelector('.strand-checkbox__icon line')).toBeInTheDocument()
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Checkbox, { props: { disabled: true } })
    expect(container.querySelector('.strand-checkbox')).toHaveClass('strand-checkbox--disabled')
    expect(container.querySelector('.strand-checkbox__native')).toBeDisabled()
  })

  it('renders label text', () => {
    const { container } = render(Checkbox, { props: { label: 'Accept terms' } })
    const labelEl = container.querySelector('.strand-checkbox__label')
    expect(labelEl).toBeInTheDocument()
    expect(labelEl).toHaveTextContent('Accept terms')
  })

  it('does not render label when not provided', () => {
    const { container } = render(Checkbox)
    expect(container.querySelector('.strand-checkbox__label')).not.toBeInTheDocument()
  })

  it('control has aria-hidden', () => {
    const { container } = render(Checkbox)
    expect(container.querySelector('.strand-checkbox__control')).toHaveAttribute('aria-hidden', 'true')
  })

  it('unchecked state has aria-checked false', () => {
    const { container } = render(Checkbox)
    expect(container.querySelector('.strand-checkbox__native')).toHaveAttribute('aria-checked', 'false')
  })
})
