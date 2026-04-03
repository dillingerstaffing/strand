import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import Stack from './Stack.vue'

describe('Stack', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('applies strand-stack base class', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.className).toContain('strand-stack')
  })

  // ── Direction ──

  it('applies vertical direction class by default', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.className).toContain('strand-stack--vertical')
  })

  it('applies horizontal direction class', () => {
    const { container } = render(Stack, {
      props: { direction: 'horizontal' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.className).toContain('strand-stack--horizontal')
  })

  // ── Gap ──

  it('sets gap with default space-4', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gap).toBe('var(--strand-space-4)')
  })

  it('sets gap to match gap prop', () => {
    const { container } = render(Stack, {
      props: { gap: 8 },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gap).toBe('var(--strand-space-8)')
  })

  // ── Align ──

  it('does not apply align class when stretch (default)', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.className).not.toContain('strand-stack--align-')
  })

  it('applies align-center class', () => {
    const { container } = render(Stack, {
      props: { align: 'center' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.className).toContain('strand-stack--align-center')
  })

  it('applies align-start class', () => {
    const { container } = render(Stack, {
      props: { align: 'start' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.className).toContain('strand-stack--align-start')
  })

  it('applies align-end class', () => {
    const { container } = render(Stack, {
      props: { align: 'end' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.className).toContain('strand-stack--align-end')
  })

  // ── Justify ──

  it('does not apply justify class by default', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.className).not.toContain('strand-stack--justify-')
  })

  it('applies justify-center class', () => {
    const { container } = render(Stack, {
      props: { justify: 'center' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.className).toContain('strand-stack--justify-center')
  })

  it('applies justify-between class', () => {
    const { container } = render(Stack, {
      props: { justify: 'between' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.className).toContain('strand-stack--justify-between')
  })

  // ── Wrap ──

  it('does not apply wrap class by default', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } })
    expect(container.firstElementChild?.className).not.toContain('strand-stack--wrap')
  })

  it('applies wrap class when enabled', () => {
    const { container } = render(Stack, {
      props: { wrap: true },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.className).toContain('strand-stack--wrap')
  })

  // ── Custom className ──

  it('merges custom className', () => {
    const { container } = render(Stack, {
      props: { className: 'custom' },
      slots: { default: '<div>Item</div>' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-stack')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(Stack, {
      attrs: { id: 'my-stack' },
      slots: { default: '<div>Item</div>' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('my-stack')
  })
})
