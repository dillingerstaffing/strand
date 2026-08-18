/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Radio from './Radio.svelte'

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

  it('calls onchange when clicked, and not when disabled', async () => {
    const onchange = vi.fn()
    const enabled = render(Radio, { props: { onchange } })
    await fireEvent.click(enabled.container.querySelector('input') as HTMLInputElement)
    expect(onchange).toHaveBeenCalledTimes(1)
    enabled.unmount()
    const blocked = vi.fn()
    const disabled = render(Radio, { props: { disabled: true, onchange: blocked } })
    const input = disabled.container.querySelector('input') as HTMLInputElement
    expect(input).toBeDisabled()
    await fireEvent.click(input)
    expect(blocked).not.toHaveBeenCalled()
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
