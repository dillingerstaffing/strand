/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Switch from './Switch.svelte'

describe('Switch', () => {
  it('renders with default classes', () => {
    const { container } = render(Switch)
    expect(container.querySelector('.strand-switch')).toBeInTheDocument()
    const btn = container.querySelector('.strand-switch__track')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('role', 'switch')
    expect(btn).toHaveAttribute('aria-checked', 'false')
  })

  it('applies checked class and aria-checked', () => {
    const { container } = render(Switch, { props: { checked: true } })
    expect(container.querySelector('.strand-switch')).toHaveClass('strand-switch--checked')
    expect(container.querySelector('.strand-switch__track')).toHaveAttribute('aria-checked', 'true')
  })

  it('applies disabled class and attribute', () => {
    const { container } = render(Switch, { props: { disabled: true } })
    expect(container.querySelector('.strand-switch')).toHaveClass('strand-switch--disabled')
    expect(container.querySelector('.strand-switch__track')).toBeDisabled()
  })

  it('renders label text', () => {
    const { container } = render(Switch, { props: { label: 'Dark mode' } })
    const labelEl = container.querySelector('.strand-switch__label')
    expect(labelEl).toBeInTheDocument()
    expect(labelEl).toHaveTextContent('Dark mode')
  })

  it('does not render label when not provided', () => {
    const { container } = render(Switch)
    expect(container.querySelector('.strand-switch__label')).not.toBeInTheDocument()
  })

  it('fires onchange callback on click', async () => {
    const onchange = vi.fn()
    const { container } = render(Switch, { props: { onchange } })
    await fireEvent.click(container.querySelector('.strand-switch__track')!)
    expect(onchange).toHaveBeenCalledWith(true)
  })

  it('does not fire onchange when disabled', async () => {
    const onchange = vi.fn()
    const { container } = render(Switch, { props: { disabled: true, onchange } })
    await fireEvent.click(container.querySelector('.strand-switch__track')!)
    expect(onchange).not.toHaveBeenCalled()
  })

  it('has thumb with aria-hidden', () => {
    const { container } = render(Switch)
    const thumb = container.querySelector('.strand-switch__thumb')
    expect(thumb).toBeInTheDocument()
    expect(thumb).toHaveAttribute('aria-hidden', 'true')
  })
})
