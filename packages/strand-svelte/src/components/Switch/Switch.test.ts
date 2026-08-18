/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Switch from './Switch.svelte'

describe('Switch', () => {
  it('renders as a switch that reports its state through aria-checked', () => {
    const off = render(Switch)
    expect(off.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    off.unmount()
    const on = render(Switch, { props: { checked: true } })
    expect(on.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('owns its state and reports the toggled value on click', async () => {
    const onchange = vi.fn()
    const { getByRole } = render(Switch, { props: { checked: true, onchange } })
    await fireEvent.click(getByRole('switch'))
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    expect(onchange).toHaveBeenCalledWith(false)
    await fireEvent.click(getByRole('switch'))
    expect(onchange).toHaveBeenLastCalledWith(true)
  })

  it('does not toggle or call onchange when disabled', async () => {
    const onchange = vi.fn()
    const { getByRole } = render(Switch, { props: { disabled: true, onchange } })
    expect(getByRole('switch')).toBeDisabled()
    await fireEvent.click(getByRole('switch'))
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    expect(onchange).not.toHaveBeenCalled()
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
