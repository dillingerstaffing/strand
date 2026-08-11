/*! Strand Vue | MIT License | dillingerstaffing.com */

// ActionDock's POSITIONING is geometry and belongs to the layout tier, which
// asserts it in real Chromium with a pair of bounds. jsdom reports zero for
// every box, so nothing here tries to prove where the dock sits.
//
// What IS testable here, and what this file covers, is the contract a consumer
// programs against: the default, the attribute that drives visibility, that
// the control stays mounted while hidden, and that composing a class or an
// attribute does not silently drop the component's own. Those are the same six
// claims the Preact implementation asserts, so the ports cannot drift from the
// canonical one without something going red.

import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import ActionDock from './ActionDock.vue'

const dockOf = (container: HTMLElement) =>
  container.querySelector('.strand-actiondock') as HTMLElement

describe('ActionDock', () => {
  it('hides by default, so a dock nobody drives occludes nothing', () => {
    const { container } = render(ActionDock)
    expect(dockOf(container)).toHaveAttribute('data-strand-actiondock', 'hidden')
  })

  it('shows when told to', () => {
    const { container } = render(ActionDock, { props: { visible: true } })
    expect(dockOf(container)).toHaveAttribute('data-strand-actiondock', 'visible')
  })

  it('keeps the control mounted while hidden, so showing it costs no render', () => {
    const { container, getByText } = render(ActionDock, {
      props: { visible: false },
      slots: { default: '<button>RSVP</button>' },
    })
    expect(getByText('RSVP')).toBeInTheDocument()
    expect(dockOf(container)).toHaveAttribute('data-strand-actiondock', 'hidden')
  })

  it("carries a consumer's class without dropping its own", () => {
    const { container } = render(ActionDock, { props: { className: 'my-dock' } })
    const dock = dockOf(container)
    expect(dock).toHaveClass('strand-actiondock')
    expect(dock).toHaveClass('my-dock')
  })

  it('passes arbitrary attributes through to the element', () => {
    // The documented accessibility pattern depends on this: the docked control
    // usually duplicates one already in the tree, so the consumer marks the
    // copy aria-hidden. If the attribute did not reach the element, every
    // consumer following the docs would ship a duplicate announcement.
    const { container } = render(ActionDock, {
      attrs: { 'aria-hidden': 'true', 'data-testid': 'dock' },
    })
    const dock = dockOf(container)
    expect(dock).toHaveAttribute('aria-hidden', 'true')
    expect(dock).toHaveAttribute('data-testid', 'dock')
  })

  it('renders one element and no structural wrapper of its own', () => {
    const { container } = render(ActionDock, { slots: { default: '<button>RSVP</button>' } })
    const dock = dockOf(container)
    expect(dock.parentElement).toBe(container)
    expect(dock.children).toHaveLength(1)
  })
})
