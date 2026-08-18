/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Tooltip from './Tooltip.vue'

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function renderTooltip(props: Record<string, unknown> = {}) {
    return render(Tooltip, {
      props: { content: 'Hint', ...props },
      slots: { default: '<button type="button">Hover me</button>' },
    })
  }

  it('renders children', () => {
    const { getByText } = renderTooltip()
    expect(getByText('Hover me')).toBeTruthy()
  })

  it('renders tooltip content text', () => {
    const { container } = renderTooltip({ content: 'Helpful tip' })
    const tooltip = container.querySelector('[role="tooltip"]')
    expect(tooltip).toBeTruthy()
    expect(tooltip!.textContent).toBe('Helpful tip')
  })

  it('tooltip is hidden by default', () => {
    const { container } = renderTooltip({ content: 'Hidden' })
    const tooltip = container.querySelector('[role="tooltip"]')
    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows tooltip on mouseenter after delay', async () => {
    const { container } = renderTooltip({ content: 'Visible', delay: 100 })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')!
    const tooltip = container.querySelector('[role="tooltip"]')!

    await fireEvent.mouseEnter(wrapper)
    vi.advanceTimersByTime(100)
    await vi.dynamicImportSettled()

    expect(tooltip).toHaveAttribute('aria-hidden', 'false')
  })

  it('hides tooltip on mouseleave', async () => {
    const { container } = renderTooltip({ content: 'Gone', delay: 100 })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')!
    const tooltip = container.querySelector('[role="tooltip"]')!

    await fireEvent.mouseEnter(wrapper)
    vi.advanceTimersByTime(100)
    await vi.dynamicImportSettled()
    expect(tooltip).toHaveAttribute('aria-hidden', 'false')

    await fireEvent.mouseLeave(wrapper)
    await vi.dynamicImportSettled()
    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
  })

  it('the trigger element itself is described by the tooltip', () => {
    const { container } = renderTooltip({ content: 'Described' })
    const button = container.querySelector('button')!
    const tooltip = container.querySelector('[role="tooltip"]')!
    expect(button).toHaveAttribute('aria-describedby', tooltip.getAttribute('id'))
    expect(container.querySelector('.strand-tooltip__wrapper')).not.toHaveAttribute('aria-describedby')
  })

  it('Escape dismisses an open tooltip and reports the change', async () => {
    const { container, emitted } = renderTooltip({ content: 'Dismiss', delay: 0 })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')!
    const tooltip = container.querySelector('[role="tooltip"]')!
    await fireEvent.mouseEnter(wrapper)
    vi.advanceTimersByTime(1)
    await vi.dynamicImportSettled()
    expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    await fireEvent.keyDown(wrapper, { key: 'Escape' })
    await vi.dynamicImportSettled()
    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
    expect(emitted()['update:open']).toEqual([[true], [false]])
  })

  it('a controlled tooltip shows what its owner says', async () => {
    const { container, rerender } = renderTooltip({ content: 'Owned', open: true })
    const tooltip = container.querySelector('[role="tooltip"]')!
    expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    await fireEvent.mouseLeave(container.querySelector('.strand-tooltip__wrapper')!)
    await vi.dynamicImportSettled()
    expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    await rerender({ content: 'Owned', open: false })
    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
  })

  it('tooltip has role tooltip', () => {
    const { container } = renderTooltip({ content: 'Accessible' })
    expect(container.querySelector('[role="tooltip"]')).toBeTruthy()
  })

  it('applies top position class by default', () => {
    const { container } = renderTooltip({ content: 'Top' })
    const tooltip = container.querySelector('[role="tooltip"]')!
    expect(tooltip.className).toContain('strand-tooltip--top')
  })

  it('applies right position class', () => {
    const { container } = renderTooltip({ content: 'Right', position: 'right' })
    const tooltip = container.querySelector('[role="tooltip"]')!
    expect(tooltip.className).toContain('strand-tooltip--right')
  })

  it('applies bottom position class', () => {
    const { container } = renderTooltip({ content: 'Bottom', position: 'bottom' })
    const tooltip = container.querySelector('[role="tooltip"]')!
    expect(tooltip.className).toContain('strand-tooltip--bottom')
  })

  it('applies left position class', () => {
    const { container } = renderTooltip({ content: 'Left', position: 'left' })
    const tooltip = container.querySelector('[role="tooltip"]')!
    expect(tooltip.className).toContain('strand-tooltip--left')
  })

  it('cancels show if mouseleave before delay completes', async () => {
    const { container } = renderTooltip({ content: 'Cancelled', delay: 300 })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')!
    const tooltip = container.querySelector('[role="tooltip"]')!

    await fireEvent.mouseEnter(wrapper)
    vi.advanceTimersByTime(100)
    await fireEvent.mouseLeave(wrapper)
    vi.advanceTimersByTime(300)
    await vi.dynamicImportSettled()

    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows on focus for keyboard accessibility', async () => {
    const { container } = renderTooltip({ content: 'Focused', delay: 100 })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')!
    const tooltip = container.querySelector('[role="tooltip"]')!

    await fireEvent.focusIn(container.querySelector('button')!)
    vi.advanceTimersByTime(100)
    await vi.dynamicImportSettled()

    expect(tooltip).toHaveAttribute('aria-hidden', 'false')
  })

  it('hides on blur', async () => {
    const { container } = renderTooltip({ content: 'Blurred', delay: 100 })
    const wrapper = container.querySelector('.strand-tooltip__wrapper')!
    const tooltip = container.querySelector('[role="tooltip"]')!

    await fireEvent.focusIn(container.querySelector('button')!)
    vi.advanceTimersByTime(100)
    await vi.dynamicImportSettled()
    expect(tooltip).toHaveAttribute('aria-hidden', 'false')

    await fireEvent.focusOut(container.querySelector('button')!)
    await vi.dynamicImportSettled()
    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
  })
})
