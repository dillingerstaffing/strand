/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Switch from './Switch.vue'

describe('Switch', () => {
  it('renders as a switch that reports its state through aria-checked', () => {
    const off = render(Switch, { props: { checked: false } })
    expect(off.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    off.unmount()
    const on = render(Switch, { props: { checked: true } })
    expect(on.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('emits change and update:checked with the toggled value when clicked', async () => {
    const off = render(Switch, { props: { checked: false } })
    await fireEvent.click(off.getByRole('switch'))
    expect(off.emitted('change')?.[0]).toEqual([true])
    expect(off.emitted('update:checked')?.[0]).toEqual([true])
    off.unmount()
    const on = render(Switch, { props: { checked: true } })
    await fireEvent.click(on.getByRole('switch'))
    expect(on.emitted('change')?.[0]).toEqual([false])
  })

  it('owns its state when uncontrolled: defaultChecked, then toggling on click', async () => {
    const { getByRole, emitted } = render(Switch, { props: { defaultChecked: true } })
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    await fireEvent.click(getByRole('switch'))
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    expect(emitted('change')?.[0]).toEqual([false])
  })

  it('does not emit change when disabled', async () => {
    const { getByRole, emitted } = render(Switch, { props: { disabled: true } })
    expect(getByRole('switch')).toBeDisabled()
    await fireEvent.click(getByRole('switch'))
    expect(emitted('change')).toBeUndefined()
  })

  it('renders the thumb hidden from assistive tech, and the label only when given', () => {
    const { container, getByText } = render(Switch, { props: { label: 'Dark mode' } })
    expect(container.querySelector('.strand-switch__track .strand-switch__thumb[aria-hidden="true"]')).toBeInTheDocument()
    expect(getByText('Dark mode')).toHaveClass('strand-switch__label')
    expect(render(Switch).container.querySelector('.strand-switch__label')).toBeNull()
  })

  it('compact is a class, never an inline size', () => {
    const { container } = render(Switch, { props: { density: 'compact' } })
    const el = container.querySelector('.strand-switch') as HTMLElement
    expect(el).toHaveClass('strand-switch--compact')
    expect(el.getAttribute('style') || '').not.toContain('min-height')
  })
})
