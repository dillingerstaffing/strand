/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import LabTip from './LabTip.svelte'
import LabTipBubble from './LabTipBubble.svelte'

describe('LabTip (Svelte)', () => {
  it('Tip base class', () => {
    const { container } = render(LabTip)
    expect(container.querySelector('.strand-ref-tip')).toBeInTheDocument()
  })

  it('Tip pinned modifier', () => {
    const { container } = render(LabTip, { props: { pinned: true } })
    expect(container.querySelector('.strand-ref-tip')).toHaveClass('strand-ref-tip--pinned')
  })

  it('Bubble default placement top', () => {
    const { container } = render(LabTipBubble)
    expect(container.querySelector('.strand-ref-tip__bubble')).toHaveClass('strand-ref-tip__bubble--top')
  })

  it('Bubble placements', () => {
    for (const p of ['top', 'bottom', 'left', 'right'] as const) {
      const { container } = render(LabTipBubble, { props: { placement: p } })
      expect(container.querySelector('.strand-ref-tip__bubble')).toHaveClass(`strand-ref-tip__bubble--${p}`)
    }
  })

  it('Bubble role=tooltip', () => {
    const { container } = render(LabTipBubble)
    expect(container.querySelector('.strand-ref-tip__bubble')?.getAttribute('role')).toBe('tooltip')
  })
})
