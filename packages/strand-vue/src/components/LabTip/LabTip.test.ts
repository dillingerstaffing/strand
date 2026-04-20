import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import LabTip from './LabTip.vue'
import LabTipBubble from './LabTipBubble.vue'

describe('LabTip (Vue)', () => {
  it('Tip base class', () => {
    const { container } = render(LabTip, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-tip')
  })

  it('Tip pinned modifier', () => {
    const { container } = render(LabTip, {
      props: { pinned: true },
      slots: { default: 'x' },
    })
    expect(container.firstElementChild?.className).toContain('strand-ref-tip--pinned')
  })

  it('Bubble default placement top', () => {
    const { container } = render(LabTipBubble, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-tip__bubble--top')
  })

  it('Bubble accepts placements', () => {
    for (const p of ['top', 'bottom', 'left', 'right'] as const) {
      const { container } = render(LabTipBubble, {
        props: { placement: p },
        slots: { default: 'x' },
      })
      expect(container.firstElementChild?.className).toContain(`strand-ref-tip__bubble--${p}`)
    }
  })

  it('Bubble role=tooltip', () => {
    const { container } = render(LabTipBubble, { slots: { default: 'x' } })
    expect(container.firstElementChild?.getAttribute('role')).toBe('tooltip')
  })
})
