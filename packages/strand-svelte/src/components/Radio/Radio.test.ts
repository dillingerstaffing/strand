/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Radio from './Radio.svelte'

describe('Radio', () => {
  it('renders with default classes', () => {
    const { container } = render(Radio)
    expect(container.querySelector('.strand-radio')).toBeInTheDocument()
    const input = container.querySelector('.strand-radio__native')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'radio')
  })

  it('applies checked class', () => {
    const { container } = render(Radio, { props: { checked: true } })
    expect(container.querySelector('.strand-radio')).toHaveClass('strand-radio--checked')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Radio, { props: { disabled: true } })
    expect(container.querySelector('.strand-radio')).toHaveClass('strand-radio--disabled')
    expect(container.querySelector('.strand-radio__native')).toBeDisabled()
  })

  it('renders label text', () => {
    const { container } = render(Radio, { props: { label: 'Option A' } })
    const labelEl = container.querySelector('.strand-radio__label')
    expect(labelEl).toBeInTheDocument()
    expect(labelEl).toHaveTextContent('Option A')
  })

  it('does not render label when not provided', () => {
    const { container } = render(Radio)
    expect(container.querySelector('.strand-radio__label')).not.toBeInTheDocument()
  })

  it('passes name and value', () => {
    const { container } = render(Radio, { props: { name: 'group1', value: 'a' } })
    const input = container.querySelector('.strand-radio__native')
    expect(input).toHaveAttribute('name', 'group1')
    expect(input).toHaveAttribute('value', 'a')
  })

  it('has control with aria-hidden and dot', () => {
    const { container } = render(Radio)
    const control = container.querySelector('.strand-radio__control')
    expect(control).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.strand-radio__dot')).toBeInTheDocument()
  })
})
