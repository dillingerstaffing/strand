import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import LabUtilRow from './LabUtilRow.vue'
import LabUtilCell from './LabUtilCell.vue'
import LabUtilCellCode from './LabUtilCellCode.vue'
import LabUtilCellCaption from './LabUtilCellCaption.vue'
import LabUtilCellDemo from './LabUtilCellDemo.vue'
import LabUtilCellBlock from './LabUtilCellBlock.vue'

describe('LabUtilCell family (Vue)', () => {
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
      const { container } = render(C, { slots: { default: 'x' } })
      expect(container.firstElementChild?.className).toContain(cls)
    })
  }
})
