import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import InstrumentViewport from './InstrumentViewport.vue'

describe('InstrumentViewport', () => {
  // ── Rendering ──

  it('renders a div element', () => {
    const { container } = render(InstrumentViewport, { slots: { default: 'Content' } })
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders slot content', () => {
    const { getByText } = render(InstrumentViewport, { slots: { default: 'Dark viewport' } })
    expect(getByText('Dark viewport')).toBeTruthy()
  })

  // ── Base class ──

  it('applies base class', () => {
    const { container } = render(InstrumentViewport, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).toContain('strand-instrument-viewport')
  })

  // ── Grid modifier ──

  it('does not apply grid modifier by default', () => {
    const { container } = render(InstrumentViewport, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).not.toContain('strand-instrument-viewport--grid')
  })

  it('applies grid modifier when grid prop is true', () => {
    const { container } = render(InstrumentViewport, {
      props: { grid: true },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain('strand-instrument-viewport--grid')
  })

  // ── Full bleed modifier ──

  it('does not apply full-bleed modifier by default', () => {
    const { container } = render(InstrumentViewport, { slots: { default: 'Test' } })
    expect(container.firstElementChild?.className).not.toContain(
      'strand-instrument-viewport--full-bleed',
    )
  })

  it('applies full-bleed modifier when fullBleed prop is true', () => {
    const { container } = render(InstrumentViewport, {
      props: { fullBleed: true },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.className).toContain(
      'strand-instrument-viewport--full-bleed',
    )
  })

  // ── Custom className ──

  it('merges custom className with component classes', () => {
    const { container } = render(InstrumentViewport, {
      props: { className: 'custom' },
      slots: { default: 'Test' },
    })
    const el = container.firstElementChild
    expect(el?.className).toContain('strand-instrument-viewport')
    expect(el?.className).toContain('custom')
  })

  // ── Props forwarding ──

  it('forwards additional attributes', () => {
    const { container } = render(InstrumentViewport, {
      attrs: { id: 'viewport-1', 'data-testid': 'my-viewport' },
      slots: { default: 'Test' },
    })
    expect(container.firstElementChild?.getAttribute('id')).toBe('viewport-1')
  })
})
