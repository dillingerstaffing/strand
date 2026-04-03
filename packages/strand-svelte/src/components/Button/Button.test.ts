/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Button from './Button.svelte'

describe('Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(Button)
    const btn = getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass('strand-btn', 'strand-btn--primary', 'strand-btn--md')
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn).not.toBeDisabled()
  })

  it('applies variant classes', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const
    for (const variant of variants) {
      const { container, unmount } = render(Button, { props: { variant } })
      expect(container.querySelector('.strand-btn')).toHaveClass(`strand-btn--${variant}`)
      unmount()
    }
  })

  it('applies size classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    for (const size of sizes) {
      const { container, unmount } = render(Button, { props: { size } })
      expect(container.querySelector('.strand-btn')).toHaveClass(`strand-btn--${size}`)
      unmount()
    }
  })

  it('fires click event when clicked', async () => {
    const onClick = vi.fn()
    const { getByRole } = render(Button, { props: { onclick: onClick } })
    await fireEvent.click(getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('does not fire click when disabled', async () => {
    const onClick = vi.fn()
    const { getByRole } = render(Button, { props: { disabled: true, onclick: onClick } })
    await fireEvent.click(getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('sets disabled and aria-disabled when disabled', () => {
    const { getByRole } = render(Button, { props: { disabled: true } })
    const btn = getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows loading state with spinner and aria-busy', () => {
    const { getByRole, container } = render(Button, { props: { loading: true } })
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
    const { container } = render(Button, { props: { loading: true } })
    const content = container.querySelector('.strand-btn__content')
    expect(content).toHaveStyle({ visibility: 'hidden' })
  })

  it('does not fire click when loading', async () => {
    const onClick = vi.fn()
    const { getByRole } = render(Button, { props: { loading: true, onclick: onClick } })
    await fireEvent.click(getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies iconOnly class', () => {
    const { getByRole } = render(Button, { props: { iconOnly: true } })
    expect(getByRole('button')).toHaveClass('strand-btn--icon-only')
  })

  it('applies fullWidth class', () => {
    const { getByRole } = render(Button, { props: { fullWidth: true } })
    expect(getByRole('button')).toHaveClass('strand-btn--full-width')
  })

  it('passes type attribute', () => {
    const { getByRole } = render(Button, { props: { type: 'submit' } })
    expect(getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('does not set aria-disabled when not disabled', () => {
    const { getByRole } = render(Button)
    expect(getByRole('button')).not.toHaveAttribute('aria-disabled')
  })

  it('does not set aria-busy when not loading', () => {
    const { getByRole } = render(Button)
    expect(getByRole('button')).not.toHaveAttribute('aria-busy')
  })

  it('does not show spinner when not loading', () => {
    const { container } = render(Button)
    expect(container.querySelector('.strand-btn__spinner')).not.toBeInTheDocument()
  })
})
