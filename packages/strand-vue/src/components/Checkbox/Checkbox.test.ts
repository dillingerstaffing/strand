/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Checkbox from './Checkbox.vue'

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

  it('owns its state when uncontrolled: defaultChecked, then toggling on click', async () => {
    const { container } = render(Checkbox, { props: { defaultChecked: true } })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input).toBeChecked()
    await fireEvent.click(input)
    expect(input).not.toBeChecked()
  })

  it('emits change and update:checked when clicked, and nothing when disabled', async () => {
    const enabled = render(Checkbox)
    await fireEvent.click(enabled.container.querySelector('input') as HTMLInputElement)
    expect(enabled.emitted('change')).toHaveLength(1)
    expect(enabled.emitted('update:checked')?.[0]).toEqual([true])
    enabled.unmount()
    const disabled = render(Checkbox, { props: { disabled: true } })
    const input = disabled.container.querySelector('input') as HTMLInputElement
    expect(input).toBeDisabled()
    await fireEvent.click(input)
    expect(disabled.emitted('change')).toBeUndefined()
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
