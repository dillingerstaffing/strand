/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Switch from './Switch.vue'

describe('Switch', () => {
  // -- Rendering --

  it('renders as switch role', () => {
    const { getByRole } = render(Switch)
    expect(getByRole('switch')).toBeTruthy()
  })

  // -- Toggle on click --

  it('emits change with true when unchecked switch is clicked', async () => {
    const { getByRole, emitted } = render(Switch)
    await fireEvent.click(getByRole('switch'))
    expect(emitted().change[0]).toEqual([true])
  })

  it('emits change with false when checked switch is clicked', async () => {
    const { getByRole, emitted } = render(Switch, {
      props: { checked: true },
    })
    await fireEvent.click(getByRole('switch'))
    expect(emitted().change[0]).toEqual([false])
  })

  // -- Toggle on Space key --

  it('toggles on Space key', async () => {
    const { getByRole, emitted } = render(Switch)
    await fireEvent.keyDown(getByRole('switch'), { key: ' ' })
    expect(emitted().change[0]).toEqual([true])
  })

  // -- Toggle on Enter key --

  it('toggles on Enter key', async () => {
    const { getByRole, emitted } = render(Switch)
    await fireEvent.keyDown(getByRole('switch'), { key: 'Enter' })
    expect(emitted().change[0]).toEqual([true])
  })

  // -- Checked state --

  it('sets aria-checked true when checked', () => {
    const { getByRole } = render(Switch, {
      props: { checked: true },
    })
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('sets aria-checked false when unchecked', () => {
    const { getByRole } = render(Switch, {
      props: { checked: false },
    })
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('applies checked class', () => {
    const { container } = render(Switch, {
      props: { checked: true },
    })
    expect(container.querySelector('.strand-switch--checked')).toBeTruthy()
  })

  // -- Disabled state --

  it('disables the switch when disabled prop is set', () => {
    const { getByRole } = render(Switch, {
      props: { disabled: true },
    })
    expect(getByRole('switch')).toBeDisabled()
  })

  it('does not emit change when disabled', async () => {
    const { getByRole, emitted } = render(Switch, {
      props: { disabled: true },
    })
    await fireEvent.click(getByRole('switch'))
    expect(emitted().change).toBeUndefined()
  })

  it('applies disabled class', () => {
    const { container } = render(Switch, {
      props: { disabled: true },
    })
    expect(container.querySelector('.strand-switch--disabled')).toBeTruthy()
  })

  // -- Inline label --

  it('renders inline label text', () => {
    const { getByText } = render(Switch, {
      props: { label: 'Dark mode' },
    })
    expect(getByText('Dark mode')).toBeTruthy()
  })

  it('does not render label span without label prop', () => {
    const { container } = render(Switch)
    expect(container.querySelector('.strand-switch__label')).not.toBeInTheDocument()
  })

  // -- Structure --

  it('renders thumb with aria-hidden', () => {
    const { container } = render(Switch)
    const thumb = container.querySelector('.strand-switch__thumb')
    expect(thumb).toBeInTheDocument()
    expect(thumb).toHaveAttribute('aria-hidden', 'true')
  })
})
