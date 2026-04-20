/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import TypeSpecimen from './TypeSpecimen.svelte'
import TypeSpecimenMeta from './TypeSpecimenMeta.svelte'

describe('TypeSpecimen (Svelte)', () => {
  it('base class', () => {
    const { container } = render(TypeSpecimen)
    expect(container.querySelector('.strand-type-specimen')).toBeInTheDocument()
  })

  it('Meta span + base class', () => {
    const { container } = render(TypeSpecimenMeta)
    expect(container.querySelector('span.strand-type-specimen__meta')).toBeInTheDocument()
  })
})
