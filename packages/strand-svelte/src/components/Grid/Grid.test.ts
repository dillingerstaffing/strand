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

  it('renders a responsive auto-fit track when minColWidth is set', () => {
    const { container } = render(Grid, { props: { minColWidth: 220 } })
    const el = container.querySelector('.strand-grid') as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(220px, 1fr))')
  })

  it('lets minColWidth win over columns', () => {
    const { container } = render(Grid, { props: { columns: 3, minColWidth: 220 } })
    const el = container.querySelector('.strand-grid') as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(220px, 1fr))')
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

  // ── Sidebar preset ──
  // Its GEOMETRY is asserted in the layout tier, because jsdom neither lays
  // out nor resolves media queries. These pin the contract a consumer
  // programs against, mirroring the canonical Preact assertions.

  it('renders the sidebar preset as a class, not an inline template', () => {
    // The column definition changes at a breakpoint and an inline style
    // cannot carry a media query, so emitting one would produce a
    // declaration the stylesheet then has to fight at every width.
    const { container } = render(Grid, { props: { sidebar: true } })
    const grid = container.querySelector('.strand-grid') as HTMLElement
    expect(grid.classList.contains('strand-grid--sidebar')).toBe(true)
    expect(grid.style.gridTemplateColumns).toBe('')
  })

  it('keeps the gap when the sidebar preset owns the columns', () => {
    const { container } = render(Grid, { props: { sidebar: true, gap: 6 } })
    const grid = container.querySelector('.strand-grid') as HTMLElement
    expect(grid.style.gap).toBe('var(--strand-space-6)')
  })

  it('lets the sidebar preset win over columns and minColWidth', () => {
    const { container } = render(Grid, {
      props: { sidebar: true, columns: 4, minColWidth: 220 },
    })
    const grid = container.querySelector('.strand-grid') as HTMLElement
    expect(grid.style.gridTemplateColumns).toBe('')
  })

  it('does not apply the preset unless asked', () => {
    const { container } = render(Grid, { props: { columns: 2 } })
    const grid = container.querySelector('.strand-grid') as HTMLElement
    expect(grid.classList.contains('strand-grid--sidebar')).toBe(false)
  })
})
