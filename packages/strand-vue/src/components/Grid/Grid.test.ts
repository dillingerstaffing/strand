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
    expect(el.style.gridTemplateColumns).toBe('repeat(1, 1fr)')
  })

  it('sets grid-template-columns to match columns prop', () => {
    const { container } = render(Grid, {
      props: { columns: 3 },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
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
})
