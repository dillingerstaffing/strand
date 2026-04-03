/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Button from './Button.vue'

describe('Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(Button, {
      slots: { default: 'Click me' },
    })
    const btn = getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass('strand-btn', 'strand-btn--primary', 'strand-btn--md')
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn).not.toBeDisabled()
    expect(btn).toHaveTextContent('Click me')
  })

  it('applies variant classes', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const
    for (const variant of variants) {
      const { container, unmount } = render(Button, {
        props: { variant },
        slots: { default: 'Btn' },
      })
      expect(container.querySelector('.strand-btn')).toHaveClass(`strand-btn--${variant}`)
      unmount()
    }
  })

  it('applies size classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    for (const size of sizes) {
      const { container, unmount } = render(Button, {
        props: { size },
        slots: { default: 'Btn' },
      })
      expect(container.querySelector('.strand-btn')).toHaveClass(`strand-btn--${size}`)
      unmount()
    }
  })

  it('emits click event when clicked', async () => {
    const { getByRole, emitted } = render(Button, {
      slots: { default: 'Click me' },
    })
    await fireEvent.click(getByRole('button'))
    expect(emitted().click).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const { getByRole, emitted } = render(Button, {
      props: { disabled: true },
      slots: { default: 'Click me' },
    })
    await fireEvent.click(getByRole('button'))
    expect(emitted().click).toBeUndefined()
  })

  it('sets disabled and aria-disabled when disabled', () => {
    const { getByRole } = render(Button, {
      props: { disabled: true },
      slots: { default: 'Btn' },
    })
    const btn = getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows loading state with spinner and aria-busy', () => {
    const { getByRole, container } = render(Button, {
      props: { loading: true },
      slots: { default: 'Loading' },
    })
    const btn = getByRole('button')
    expect(btn).toHaveClass('strand-btn--loading')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
    const spinner = container.querySelector('.strand-btn__spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
  })

  it('hides content visibility when loading', () => {
    const { container } = render(Button, {
      props: { loading: true },
      slots: { default: 'Loading' },
    })
    const content = container.querySelector('.strand-btn__content')
    expect(content).toHaveStyle({ visibility: 'hidden' })
  })

  it('does not emit click when loading', async () => {
    const { getByRole, emitted } = render(Button, {
      props: { loading: true },
      slots: { default: 'Click me' },
    })
    await fireEvent.click(getByRole('button'))
    expect(emitted().click).toBeUndefined()
  })

  it('applies iconOnly class', () => {
    const { getByRole } = render(Button, {
      props: { iconOnly: true },
      slots: { default: 'X' },
    })
    expect(getByRole('button')).toHaveClass('strand-btn--icon-only')
  })

  it('applies fullWidth class', () => {
    const { getByRole } = render(Button, {
      props: { fullWidth: true },
      slots: { default: 'Full' },
    })
    expect(getByRole('button')).toHaveClass('strand-btn--full-width')
  })

  it('passes type attribute', () => {
    const { getByRole } = render(Button, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    })
    expect(getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('does not set aria-disabled when not disabled', () => {
    const { getByRole } = render(Button, {
      slots: { default: 'Btn' },
    })
    expect(getByRole('button')).not.toHaveAttribute('aria-disabled')
  })

  it('does not set aria-busy when not loading', () => {
    const { getByRole } = render(Button, {
      slots: { default: 'Btn' },
    })
    expect(getByRole('button')).not.toHaveAttribute('aria-busy')
  })

  it('does not show spinner when not loading', () => {
    const { container } = render(Button, {
      slots: { default: 'Btn' },
    })
    expect(container.querySelector('.strand-btn__spinner')).not.toBeInTheDocument()
  })
})
