/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Grid from './Grid.svelte'

describe('Grid', () => {
  it('renders with default class', () => {
    const { container } = render(Grid)
    const el = container.querySelector('.strand-grid')
    expect(el).toBeInTheDocument()
  })

  it('sets grid-template-columns from columns prop', () => {
    const { container } = render(Grid, { props: { columns: 3 } })
    const el = container.querySelector('.strand-grid') as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })

  it('sets gap from gap prop', () => {
    const { container } = render(Grid, { props: { gap: 6 } })
    const el = container.querySelector('.strand-grid') as HTMLElement
    expect(el.style.gap).toBe('var(--strand-space-6)')
  })

  it('uses default columns=1 and gap=4', () => {
    const { container } = render(Grid)
    const el = container.querySelector('.strand-grid') as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(1, 1fr)')
    expect(el.style.gap).toBe('var(--strand-space-4)')
  })
})
