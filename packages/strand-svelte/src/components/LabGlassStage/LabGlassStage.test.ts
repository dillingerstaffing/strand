/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import LabGlassStage from './LabGlassStage.svelte'
import LabGlassPanel from './LabGlassPanel.svelte'

describe('LabGlassStage (Svelte)', () => {
  it('Stage base class', () => {
    const { container } = render(LabGlassStage)
    expect(container.querySelector('.strand-ref-glass-stage')).toBeInTheDocument()
  })

  it('Panel base class', () => {
    const { container } = render(LabGlassPanel)
    expect(container.querySelector('.strand-ref-glass-panel')).toBeInTheDocument()
  })
})
