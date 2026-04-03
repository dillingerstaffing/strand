/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Textarea from './Textarea.svelte'

describe('Textarea', () => {
  it('renders with default classes', () => {
    const { container } = render(Textarea)
    expect(container.querySelector('.strand-textarea')).toBeInTheDocument()
    expect(container.querySelector('.strand-textarea__field')).toBeInTheDocument()
  })

  it('applies error class and aria-invalid', () => {
    const { container } = render(Textarea, { props: { error: true } })
    expect(container.querySelector('.strand-textarea')).toHaveClass('strand-textarea--error')
    expect(container.querySelector('.strand-textarea__field')).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Textarea, { props: { disabled: true } })
    expect(container.querySelector('.strand-textarea')).toHaveClass('strand-textarea--disabled')
    expect(container.querySelector('.strand-textarea__field')).toBeDisabled()
  })

  it('applies auto-resize class', () => {
    const { container } = render(Textarea, { props: { autoResize: true } })
    expect(container.querySelector('.strand-textarea')).toHaveClass('strand-textarea--auto-resize')
  })

  it('shows character count when showCount and maxLength', () => {
    const { container } = render(Textarea, { props: { showCount: true, maxLength: 100, value: 'hello' } })
    const count = container.querySelector('.strand-textarea__count')
    expect(count).toBeInTheDocument()
    expect(count).toHaveTextContent('5/100')
    expect(count).toHaveAttribute('aria-live', 'polite')
  })

  it('does not show count without maxLength', () => {
    const { container } = render(Textarea, { props: { showCount: true } })
    expect(container.querySelector('.strand-textarea__count')).not.toBeInTheDocument()
  })

  it('does not show count when showCount is false', () => {
    const { container } = render(Textarea, { props: { maxLength: 100 } })
    expect(container.querySelector('.strand-textarea__count')).not.toBeInTheDocument()
  })

  it('does not set aria-invalid when no error', () => {
    const { container } = render(Textarea)
    expect(container.querySelector('.strand-textarea__field')).not.toHaveAttribute('aria-invalid')
  })
})
