import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Grid from './Grid.vue'

describe('Grid', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(Grid, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('applies strand-grid base class', () => {
    const { container } = render(Grid, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.className).toContain('strand-grid')
  })

  // ── Columns ──

  it('sets grid-template-columns with default 1 column', () => {
    const { container } = render(Grid, { slots: { default: '<div>Item</div>' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))')
  })

  it('sets grid-template-columns to match columns prop', () => {
    const { container } = render(Grid, {
      props: { columns: 3 },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))')
  })

  // ── Auto-fit (minColWidth) ──

  it('renders a responsive auto-fit track when minColWidth is set', () => {
    const { container } = render(Grid, {
      props: { minColWidth: 220 },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(220px, 1fr))')
  })

  it('lets minColWidth win over columns (auto-fit, not fixed count)', () => {
    const { container } = render(Grid, {
      props: { columns: 3, minColWidth: 220 },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(220px, 1fr))')
  })

  // ── Gap ──

  it('sets gap with default space-4', () => {
    const { container } = render(Grid, { slots: { default: '<div>Item</div>' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gap).toBe('var(--strand-space-4)')
  })

  it('sets gap to match gap prop', () => {
    const { container } = render(Grid, {
      props: { gap: 8 },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gap).toBe('var(--strand-space-8)')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Grid, {
      props: { className: 'custom' },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-grid')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(Grid, {
      attrs: { id: 'my-grid' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('my-grid')
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

  it('renders the split preset as a class, not an inline template', () => {
    const { container } = render(Grid, { props: { split: true } })
    const grid = container.querySelector('.strand-grid') as HTMLElement
    expect(grid.classList.contains('strand-grid--split')).toBe(true)
    expect(grid.style.gridTemplateColumns).toBe('')
  })

  it('does not apply the split preset unless asked', () => {
    const { container } = render(Grid, { props: { columns: 2 } })
    expect(
      container.querySelector('.strand-grid')?.classList.contains('strand-grid--split'),
    ).toBe(false)
  })

  it('an off-ladder gap renders a real rung instead of no gap at all (gap #122)', () => {
    const { container } = render(Grid, { props: { gap: 7 } })
    const el = container.querySelector('.strand-grid') as HTMLElement
    expect(el.getAttribute('style')).toContain('--strand-space-6')
    expect(el.getAttribute('style')).not.toContain('--strand-space-7')
  })

  it('an on-ladder gap is untouched, so no existing consumer moves', () => {
    const { container } = render(Grid, { props: { gap: 6 } })
    const el = container.querySelector('.strand-grid') as HTMLElement
    expect(el.getAttribute('style')).toContain('--strand-space-6')
  })

})
