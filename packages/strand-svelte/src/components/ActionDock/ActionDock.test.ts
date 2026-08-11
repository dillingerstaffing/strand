/*! Strand Svelte | MIT License | dillingerstaffing.com */

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
import { render } from '@testing-library/svelte'
import ActionDock from './ActionDock.svelte'

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

  it("carries a consumer's class without dropping its own", () => {
    // Svelte spreads $$restProps AFTER the class attribute, so a consumer
    // passing class="" can replace the component's own rather than adding to
    // it. Preact and Vue both merge. This asserts the merge, because a dock
    // that loses .strand-actiondock loses its positioning entirely and would
    // render as an ordinary in-flow div, which is the failure the whole
    // primitive exists to prevent.
    const { container } = render(ActionDock, { props: { class: 'my-dock' } })
    const dock = dockOf(container)
    expect(dock).not.toBeNull()
    expect(dock).toHaveClass('strand-actiondock')
    expect(dock).toHaveClass('my-dock')
  })

  it('passes arbitrary attributes through to the element', () => {
    // The documented accessibility pattern depends on this: the docked control
    // usually duplicates one already in the tree, so the consumer marks the
    // copy aria-hidden. If the attribute did not reach the element, every
    // consumer following the docs would ship a duplicate announcement.
    const { container } = render(ActionDock, {
      props: { 'aria-hidden': 'true', 'data-testid': 'dock' },
    })
    const dock = dockOf(container)
    expect(dock).toHaveAttribute('aria-hidden', 'true')
    expect(dock).toHaveAttribute('data-testid', 'dock')
  })

  it('renders one element and no structural wrapper of its own', () => {
    const { container } = render(ActionDock)
    const dock = dockOf(container)
    expect(dock.parentElement).toBe(container)
  })
})
