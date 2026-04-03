/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Textarea from './Textarea.vue'

describe('Textarea', () => {
  it('renders with default props', () => {
    const { container } = render(Textarea)
    const wrapper = container.querySelector('.strand-textarea')
    expect(wrapper).toBeInTheDocument()
    const textarea = container.querySelector('.strand-textarea__field') as HTMLTextAreaElement
    expect(textarea).toBeInTheDocument()
    expect(textarea).not.toBeDisabled()
  })

  it('applies error class and aria-invalid', () => {
    const { container } = render(Textarea, {
      props: { error: true },
    })
    const wrapper = container.querySelector('.strand-textarea')
    expect(wrapper).toHaveClass('strand-textarea--error')
    const textarea = container.querySelector('.strand-textarea__field')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid when no error', () => {
    const { container } = render(Textarea)
    const textarea = container.querySelector('.strand-textarea__field')
    expect(textarea).not.toHaveAttribute('aria-invalid')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Textarea, {
      props: { disabled: true },
    })
    const wrapper = container.querySelector('.strand-textarea')
    expect(wrapper).toHaveClass('strand-textarea--disabled')
    const textarea = container.querySelector('.strand-textarea__field')
    expect(textarea).toBeDisabled()
  })

  it('applies auto-resize class', () => {
    const { container } = render(Textarea, {
      props: { autoResize: true },
    })
    expect(container.querySelector('.strand-textarea')).toHaveClass('strand-textarea--auto-resize')
  })

  it('emits update:modelValue on input', async () => {
    const { container, emitted } = render(Textarea, {
      props: { modelValue: '' },
    })
    const textarea = container.querySelector('.strand-textarea__field') as HTMLTextAreaElement
    await fireEvent.update(textarea, 'hello world')
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['hello world'])
  })

  it('shows character count when showCount and maxLength are set', () => {
    const { container } = render(Textarea, {
      props: { showCount: true, maxLength: 100, modelValue: 'hello' },
    })
    const count = container.querySelector('.strand-textarea__count')
    expect(count).toBeInTheDocument()
    expect(count).toHaveAttribute('aria-live', 'polite')
    expect(count).toHaveTextContent('5/100')
  })

  it('does not show count without maxLength', () => {
    const { container } = render(Textarea, {
      props: { showCount: true },
    })
    expect(container.querySelector('.strand-textarea__count')).not.toBeInTheDocument()
  })

  it('does not show count without showCount', () => {
    const { container } = render(Textarea, {
      props: { maxLength: 100 },
    })
    expect(container.querySelector('.strand-textarea__count')).not.toBeInTheDocument()
  })

  it('shows 0 count for empty value', () => {
    const { container } = render(Textarea, {
      props: { showCount: true, maxLength: 50, modelValue: '' },
    })
    const count = container.querySelector('.strand-textarea__count')
    expect(count).toHaveTextContent('0/50')
  })

  it('sets maxlength attribute on textarea', () => {
    const { container } = render(Textarea, {
      props: { maxLength: 200 },
    })
    const textarea = container.querySelector('.strand-textarea__field')
    expect(textarea).toHaveAttribute('maxlength', '200')
  })

  it('passes modelValue to textarea value', () => {
    const { container } = render(Textarea, {
      props: { modelValue: 'test content' },
    })
    const textarea = container.querySelector('.strand-textarea__field') as HTMLTextAreaElement
    expect(textarea.value).toBe('test content')
  })
})
