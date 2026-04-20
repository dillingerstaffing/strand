/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import LabUtilRow from './LabUtilRow.svelte'
import LabUtilCell from './LabUtilCell.svelte'
import LabUtilCellCode from './LabUtilCellCode.svelte'
import LabUtilCellCaption from './LabUtilCellCaption.svelte'
import LabUtilCellDemo from './LabUtilCellDemo.svelte'
import LabUtilCellBlock from './LabUtilCellBlock.svelte'

describe('LabUtilCell family (Svelte)', () => {
  const cases: Array<[any, string]> = [
    [LabUtilRow, 'strand-ref-util-row'],
    [LabUtilCell, 'strand-ref-util-cell'],
    [LabUtilCellCode, 'strand-ref-util-cell__code'],
    [LabUtilCellCaption, 'strand-ref-util-cell__caption'],
    [LabUtilCellDemo, 'strand-ref-util-cell__demo'],
    [LabUtilCellBlock, 'strand-ref-util-cell__block'],
  ]
  for (const [C, cls] of cases) {
    it(`${cls} renders with base class`, () => {
      const { container } = render(C)
      expect(container.querySelector(`.${cls}`)).toBeInTheDocument()
    })
  }
})
