import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import LabGlassStage from './LabGlassStage.vue'
import LabGlassPanel from './LabGlassPanel.vue'

describe('LabGlassStage (Vue)', () => {
  it('Stage base class', () => {
    const { container } = render(LabGlassStage, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-glass-stage')
  })

  it('Panel base class', () => {
    const { container } = render(LabGlassPanel, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-glass-panel')
  })
})
