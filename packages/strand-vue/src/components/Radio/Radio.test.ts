/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Radio from './Radio.vue'

describe('Radio', () => {
  it('renders a native radio with its name and value', () => {
    const { container } = render(Radio, { props: { name: 'plan', value: 'pro' } })
    const input = container.querySelector('.strand-radio .strand-radio__native') as HTMLInputElement
    expect(input.type).toBe('radio')
    expect(input.name).toBe('plan')
    expect(input.value).toBe('pro')
    expect(input).not.toBeChecked()
  })

  it('is checked when checked', () => {
    const { container } = render(Radio, { props: { checked: true } })
    expect(container.querySelector('input')).toBeChecked()
  })

  it('owns its state when uncontrolled: defaultChecked', () => {
    const { container } = render(Radio, { props: { defaultChecked: true } })
    expect(container.querySelector('input')).toBeChecked()
  })

  it('emits change and update:checked when clicked, and nothing when disabled', async () => {
    const enabled = render(Radio)
    await fireEvent.click(enabled.container.querySelector('input') as HTMLInputElement)
    expect(enabled.emitted('change')).toHaveLength(1)
    expect(enabled.emitted('update:checked')?.[0]).toEqual([true])
    enabled.unmount()
    const disabled = render(Radio, { props: { disabled: true } })
    const input = disabled.container.querySelector('input') as HTMLInputElement
    expect(input).toBeDisabled()
    await fireEvent.click(input)
    expect(disabled.emitted('change')).toBeUndefined()
  })

  it('renders the control with its dot, hidden from assistive tech', () => {
    const { container } = render(Radio)
    expect(container.querySelector('.strand-radio__control[aria-hidden="true"] .strand-radio__dot')).toBeInTheDocument()
  })

  it('renders label text only when given', () => {
    const { getByText } = render(Radio, { props: { label: 'Option A' } })
    expect(getByText('Option A')).toHaveClass('strand-radio__label')
    expect(render(Radio).container.querySelector('.strand-radio__label')).toBeNull()
  })

  it('compact is a class, never an inline size', () => {
    const { container } = render(Radio, { props: { density: 'compact' } })
    const el = container.querySelector('.strand-radio') as HTMLElement
    expect(el).toHaveClass('strand-radio--compact')
    expect(el.getAttribute('style') || '').not.toContain('min-height')
  })
})
