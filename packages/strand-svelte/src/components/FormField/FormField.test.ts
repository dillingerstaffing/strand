/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import FormField from './FormField.svelte'

describe('FormField', () => {
  it('renders with label', () => {
    const { container } = render(FormField, { props: { label: 'Email', htmlFor: 'email' } })
    expect(container.querySelector('.strand-form-field')).toBeInTheDocument()
    const labelEl = container.querySelector('.strand-form-field__label')
    expect(labelEl).toBeInTheDocument()
    expect(labelEl).toHaveTextContent('Email')
    expect(labelEl).toHaveAttribute('for', 'email')
  })

  it('shows required indicator', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name', required: true } })
    const req = container.querySelector('.strand-form-field__required')
    expect(req).toBeInTheDocument()
    expect(req).toHaveTextContent('*')
    expect(req).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not show required by default', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name' } })
    expect(container.querySelector('.strand-form-field__required')).not.toBeInTheDocument()
  })

  it('shows hint text', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name', hint: 'Enter your name' } })
    const hint = container.querySelector('.strand-form-field__hint')
    expect(hint).toBeInTheDocument()
    expect(hint).toHaveTextContent('Enter your name')
    expect(hint).toHaveAttribute('id', 'name-hint')
  })

  it('shows error text and applies error class', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name', error: 'Required' } })
    expect(container.querySelector('.strand-form-field')).toHaveClass('strand-form-field--error')
    const errorEl = container.querySelector('.strand-form-field__error')
    expect(errorEl).toBeInTheDocument()
    expect(errorEl).toHaveTextContent('Required')
    expect(errorEl).toHaveAttribute('role', 'alert')
    expect(errorEl).toHaveAttribute('id', 'name-error')
  })

  it('error takes precedence over hint', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name', error: 'Required', hint: 'Enter name' } })
    expect(container.querySelector('.strand-form-field__error')).toBeInTheDocument()
    expect(container.querySelector('.strand-form-field__hint')).not.toBeInTheDocument()
  })

  it('has control wrapper', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name' } })
    expect(container.querySelector('.strand-form-field__control')).toBeInTheDocument()
  })
  it('confirms a checked value without shouting it', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name', success: 'Available.' } })
    const el = container.querySelector('.strand-form-field__success')
    expect(el).toHaveTextContent('Available.')
    expect(el).toHaveAttribute('role', 'status')
  })

  it('shows the problem rather than the confirmation when both are set', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name', error: 'Taken', success: 'Available.', hint: '2 to 30' } })
    expect(container.querySelector('.strand-form-field__error')).toBeInTheDocument()
    expect(container.querySelector('.strand-form-field__success')).not.toBeInTheDocument()
    expect(container.querySelector('.strand-form-field__hint')).not.toBeInTheDocument()
  })

  it('replaces the hint, so one input never carries two instructions', () => {
    const { container } = render(FormField, { props: { label: 'Name', htmlFor: 'name', success: 'Available.', hint: '2 to 30' } })
    expect(container.querySelector('.strand-form-field__success')).toBeInTheDocument()
    expect(container.querySelector('.strand-form-field__hint')).not.toBeInTheDocument()
  })
})
