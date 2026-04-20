/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import LabRevealStage from './LabRevealStage.svelte'
import LabRevealLine from './LabRevealLine.svelte'

describe('LabRevealStage (Svelte)', () => {
  it('Stage base class', () => {
    const { container } = render(LabRevealStage)
    expect(container.querySelector('.strand-ref-reveal-stage')).toBeInTheDocument()
  })

  it('Line base class', () => {
    const { container } = render(LabRevealLine)
    expect(container.querySelector('.strand-ref-reveal-line')).toBeInTheDocument()
  })
})
