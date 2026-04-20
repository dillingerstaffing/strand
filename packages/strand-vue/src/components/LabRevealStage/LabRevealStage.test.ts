import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import LabRevealStage from './LabRevealStage.vue'
import LabRevealLine from './LabRevealLine.vue'

describe('LabRevealStage (Vue)', () => {
  it('Stage base class', () => {
    const { container } = render(LabRevealStage, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-reveal-stage')
  })

  it('Line base class', () => {
    const { container } = render(LabRevealLine, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-reveal-line')
  })
})
