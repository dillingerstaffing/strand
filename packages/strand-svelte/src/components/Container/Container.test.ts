/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Container from './Container.svelte'

describe('Container', () => {
  it('renders with default classes', () => {
    const { container } = render(Container)
    const el = container.querySelector('.strand-container')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('strand-container--default')
  })

  it('applies size classes', () => {
    const sizes = ['narrow', 'default', 'wide', 'full'] as const
    for (const size of sizes) {
      const { container, unmount } = render(Container, { props: { size } })
      expect(container.querySelector('.strand-container')).toHaveClass(`strand-container--${size}`)
      unmount()
    }
  })
})
