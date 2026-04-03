/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Tag from './Tag.svelte'

describe('Tag', () => {
  it('renders with default classes', () => {
    const { container } = render(Tag)
    const el = container.querySelector('.strand-tag')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-tag--solid', 'strand-tag--default')
  })

  it('applies variant classes', () => {
    const variants = ['solid', 'outlined'] as const
    for (const variant of variants) {
      const { container, unmount } = render(Tag, { props: { variant } })
      expect(container.querySelector('.strand-tag')).toHaveClass(`strand-tag--${variant}`)
      unmount()
    }
  })

  it('applies status classes', () => {
    const statuses = ['default', 'teal', 'blue', 'amber', 'red'] as const
    for (const status of statuses) {
      const { container, unmount } = render(Tag, { props: { status } })
      expect(container.querySelector('.strand-tag')).toHaveClass(`strand-tag--${status}`)
      unmount()
    }
  })

  it('renders text content in .strand-tag__text', () => {
    const { container } = render(Tag)
    expect(container.querySelector('.strand-tag__text')).toBeInTheDocument()
  })

  it('shows remove button when removable', () => {
    const { container } = render(Tag, { props: { removable: true } })
    const btn = container.querySelector('.strand-tag__remove')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label', 'Remove')
  })

  it('does not show remove button by default', () => {
    const { container } = render(Tag)
    expect(container.querySelector('.strand-tag__remove')).not.toBeInTheDocument()
  })

  it('fires onremove callback on button click', async () => {
    const onremove = vi.fn()
    const { container } = render(Tag, { props: { removable: true, onremove } })
    const btn = container.querySelector('.strand-tag__remove')!
    await fireEvent.click(btn)
    expect(onremove).toHaveBeenCalled()
  })

  it('remove button svg is aria-hidden', () => {
    const { container } = render(Tag, { props: { removable: true } })
    const svg = container.querySelector('.strand-tag__remove svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
