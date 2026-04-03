/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Input from './Input.svelte'

describe('Input', () => {
  it('renders with default classes', () => {
    const { container } = render(Input)
    const wrapper = container.querySelector('.strand-input')
    expect(wrapper).toBeInTheDocument()
    const input = container.querySelector('.strand-input__field')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('applies error class and aria-invalid', () => {
    const { container } = render(Input, { props: { error: true } })
    expect(container.querySelector('.strand-input')).toHaveClass('strand-input--error')
    expect(container.querySelector('.strand-input__field')).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Input, { props: { disabled: true } })
    expect(container.querySelector('.strand-input')).toHaveClass('strand-input--disabled')
    expect(container.querySelector('.strand-input__field')).toBeDisabled()
  })

  it('applies type attribute', () => {
    const types = ['text', 'email', 'password', 'search', 'number'] as const
    for (const type of types) {
      const { container, unmount } = render(Input, { props: { type } })
      expect(container.querySelector('.strand-input__field')).toHaveAttribute('type', type)
      unmount()
    }
  })

  it('shows leading addon area when hasLeading', () => {
    const { container } = render(Input, { props: { hasLeading: true } })
    expect(container.querySelector('.strand-input--has-leading')).toBeInTheDocument()
    const leading = container.querySelector('.strand-input__leading')
    expect(leading).toBeInTheDocument()
    expect(leading).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows trailing addon area when hasTrailing', () => {
    const { container } = render(Input, { props: { hasTrailing: true } })
    expect(container.querySelector('.strand-input--has-trailing')).toBeInTheDocument()
    const trailing = container.querySelector('.strand-input__trailing')
    expect(trailing).toBeInTheDocument()
    expect(trailing).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not show addons by default', () => {
    const { container } = render(Input)
    expect(container.querySelector('.strand-input__leading')).not.toBeInTheDocument()
    expect(container.querySelector('.strand-input__trailing')).not.toBeInTheDocument()
  })

  it('does not set aria-invalid when no error', () => {
    const { container } = render(Input)
    expect(container.querySelector('.strand-input__field')).not.toHaveAttribute('aria-invalid')
  })
})
