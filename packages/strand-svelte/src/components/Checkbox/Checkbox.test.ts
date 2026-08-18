/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Checkbox from './Checkbox.svelte'

describe('Checkbox', () => {
  it('renders a native checkbox inside the label', () => {
    const { container } = render(Checkbox)
    const input = container.querySelector('.strand-checkbox .strand-checkbox__native') as HTMLInputElement
    expect(input).toHaveAttribute('type', 'checkbox')
    expect(input).not.toBeChecked()
  })

  it('is checked when checked, and mixed when indeterminate', () => {
    const checked = render(Checkbox, { props: { checked: true } })
    expect(checked.container.querySelector('input')).toBeChecked()
    checked.unmount()
    const mixed = render(Checkbox, { props: { indeterminate: true } })
    expect(mixed.container.querySelector('input')).toBePartiallyChecked()
  })

  it('lets the input own its state: clicking toggles it', async () => {
    const { container } = render(Checkbox, { props: { checked: true } })
    const input = container.querySelector('input') as HTMLInputElement
    await fireEvent.click(input)
    expect(input).not.toBeChecked()
  })

  it('calls onchange when clicked, and not when disabled', async () => {
    const onchange = vi.fn()
    const enabled = render(Checkbox, { props: { onchange } })
    await fireEvent.click(enabled.container.querySelector('input') as HTMLInputElement)
    expect(onchange).toHaveBeenCalledTimes(1)
    enabled.unmount()
    const blocked = vi.fn()
    const disabled = render(Checkbox, { props: { disabled: true, onchange: blocked } })
    const input = disabled.container.querySelector('input') as HTMLInputElement
    expect(input).toBeDisabled()
    await fireEvent.click(input)
    expect(blocked).not.toHaveBeenCalled()
  })

  it('renders both glyphs, hidden by the sheet until the input carries a state', () => {
    const { container } = render(Checkbox)
    expect(container.querySelector('.strand-checkbox__control[aria-hidden="true"] .strand-checkbox__icon--check')).toBeInTheDocument()
    expect(container.querySelector('.strand-checkbox__control .strand-checkbox__icon--mixed')).toBeInTheDocument()
  })

  it('renders label text only when given', () => {
    const { getByText } = render(Checkbox, { props: { label: 'Accept terms' } })
    expect(getByText('Accept terms')).toHaveClass('strand-checkbox__label')
    expect(render(Checkbox).container.querySelector('.strand-checkbox__label')).toBeNull()
  })

  it('compact is a class, never an inline size', () => {
    const { container } = render(Checkbox, { props: { density: 'compact' } })
    const el = container.querySelector('.strand-checkbox') as HTMLElement
    expect(el).toHaveClass('strand-checkbox--compact')
    expect(el.getAttribute('style') || '').not.toContain('min-height')
  })
})
