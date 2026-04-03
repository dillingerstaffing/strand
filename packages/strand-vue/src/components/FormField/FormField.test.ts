/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import FormField from './FormField.vue'

describe('FormField', () => {
  it('renders with label and slot content', () => {
    const { container, getByText } = render(FormField, {
      props: { label: 'Email', htmlFor: 'email' },
      slots: { default: '<input id="email" />' },
    })
    const wrapper = container.querySelector('.strand-form-field')
    expect(wrapper).toBeInTheDocument()
    expect(getByText('Email')).toBeInTheDocument()
    const label = container.querySelector('.strand-form-field__label')
    expect(label).toHaveAttribute('for', 'email')
    const control = container.querySelector('.strand-form-field__control')
    expect(control).toBeInTheDocument()
    expect(control?.querySelector('input')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    const { container } = render(FormField, {
      props: { label: 'Name', htmlFor: 'name', required: true },
      slots: { default: '<input id="name" />' },
    })
    const required = container.querySelector('.strand-form-field__required')
    expect(required).toBeInTheDocument()
    expect(required).toHaveTextContent('*')
    expect(required).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not show required indicator by default', () => {
    const { container } = render(FormField, {
      props: { label: 'Name', htmlFor: 'name' },
      slots: { default: '<input id="name" />' },
    })
    expect(container.querySelector('.strand-form-field__required')).not.toBeInTheDocument()
  })

  it('shows hint text with correct id', () => {
    const { container, getByText } = render(FormField, {
      props: { label: 'Email', htmlFor: 'email', hint: 'We will not share this' },
      slots: { default: '<input id="email" />' },
    })
    const hint = container.querySelector('.strand-form-field__hint')
    expect(hint).toBeInTheDocument()
    expect(hint).toHaveAttribute('id', 'email-hint')
    expect(getByText('We will not share this')).toBeInTheDocument()
  })

  it('shows error text with correct id and role', () => {
    const { container, getByText } = render(FormField, {
      props: { label: 'Email', htmlFor: 'email', error: 'Required field' },
      slots: { default: '<input id="email" />' },
    })
    const error = container.querySelector('.strand-form-field__error')
    expect(error).toBeInTheDocument()
    expect(error).toHaveAttribute('id', 'email-error')
    expect(error).toHaveAttribute('role', 'alert')
    expect(getByText('Required field')).toBeInTheDocument()
  })

  it('applies error class when error is present', () => {
    const { container } = render(FormField, {
      props: { label: 'Email', htmlFor: 'email', error: 'Invalid' },
      slots: { default: '<input id="email" />' },
    })
    expect(container.querySelector('.strand-form-field')).toHaveClass('strand-form-field--error')
  })

  it('error replaces hint when both provided', () => {
    const { container } = render(FormField, {
      props: { label: 'Email', htmlFor: 'email', hint: 'Hint text', error: 'Error text' },
      slots: { default: '<input id="email" />' },
    })
    expect(container.querySelector('.strand-form-field__error')).toBeInTheDocument()
    expect(container.querySelector('.strand-form-field__hint')).not.toBeInTheDocument()
  })

  it('does not show hint or error when neither provided', () => {
    const { container } = render(FormField, {
      props: { label: 'Email', htmlFor: 'email' },
      slots: { default: '<input id="email" />' },
    })
    expect(container.querySelector('.strand-form-field__error')).not.toBeInTheDocument()
    expect(container.querySelector('.strand-form-field__hint')).not.toBeInTheDocument()
  })

  it('does not apply error class without error', () => {
    const { container } = render(FormField, {
      props: { label: 'Email', htmlFor: 'email' },
      slots: { default: '<input id="email" />' },
    })
    expect(container.querySelector('.strand-form-field')).not.toHaveClass('strand-form-field--error')
  })
})
