/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Table from './Table.vue'

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status', sortable: true },
]

const data = [
  { name: 'Alice', role: 'Engineer', status: 'Active' },
  { name: 'Bob', role: 'Designer', status: 'Away' },
]

describe('Table', () => {
  // -- Rendering --

  it('renders a table element', () => {
    const { container } = render(Table, {
      props: { columns, data },
    })
    expect(container.querySelector('table')).toBeTruthy()
  })

  it('renders column headers', () => {
    const { getByText } = render(Table, {
      props: { columns, data },
    })
    expect(getByText('Name')).toBeTruthy()
    expect(getByText('Role')).toBeTruthy()
    expect(getByText('Status')).toBeTruthy()
  })

  it('renders data rows', () => {
    const { getByText } = render(Table, {
      props: { columns, data },
    })
    expect(getByText('Alice')).toBeTruthy()
    expect(getByText('Bob')).toBeTruthy()
  })

  it('renders correct number of cells', () => {
    const { container } = render(Table, {
      props: { columns, data },
    })
    const cells = container.querySelectorAll('.strand-table__td')
    // 2 rows x 3 columns = 6 cells
    expect(cells.length).toBe(6)
  })

  it('renders correct number of header cells', () => {
    const { container } = render(Table, {
      props: { columns, data },
    })
    const headers = container.querySelectorAll('.strand-table__th')
    expect(headers.length).toBe(3)
  })

  // -- Sorting --

  it('renders sort button for sortable columns', () => {
    const { container } = render(Table, {
      props: { columns, data },
    })
    const sortButtons = container.querySelectorAll('.strand-table__sort-btn')
    // "Name" and "Status" are sortable
    expect(sortButtons.length).toBe(2)
  })

  it('does not render sort button for non-sortable columns', () => {
    const nonSortable = [{ key: 'role', header: 'Role' }]
    const { container } = render(Table, {
      props: { columns: nonSortable, data },
    })
    const sortButtons = container.querySelectorAll('.strand-table__sort-btn')
    expect(sortButtons.length).toBe(0)
  })

  it('emits sort with key and asc direction on first click', async () => {
    const { container, emitted } = render(Table, {
      props: { columns, data },
    })
    const sortButtons = container.querySelectorAll('.strand-table__sort-btn')
    await fireEvent.click(sortButtons[0])
    expect(emitted().sort[0]).toEqual(['name', 'asc'])
  })

  it('toggles sort direction on second click of same column', async () => {
    const { container, emitted } = render(Table, {
      props: { columns, data },
    })
    const sortButtons = container.querySelectorAll('.strand-table__sort-btn')
    await fireEvent.click(sortButtons[0]) // asc
    await fireEvent.click(sortButtons[0]) // desc
    expect(emitted().sort[1]).toEqual(['name', 'desc'])
  })

  // -- Responsive --

  it('wraps table in overflow-x scroll container', () => {
    const { container } = render(Table, {
      props: { columns, data },
    })
    const wrapper = container.querySelector('.strand-table-wrapper')
    expect(wrapper).toBeTruthy()
  })

  // -- Empty state --

  it('renders empty tbody when data is empty', () => {
    const { container } = render(Table, {
      props: { columns, data: [] },
    })
    const rows = container.querySelectorAll('.strand-table__row')
    expect(rows.length).toBe(0)
  })

  // -- Column width --

  it('applies width style to column headers', () => {
    const cols = [{ key: 'name', header: 'Name', width: '200px' }]
    const { container } = render(Table, {
      props: { columns: cols, data: [] },
    })
    const th = container.querySelector('.strand-table__th') as HTMLElement
    expect(th?.style.width).toBe('200px')
  })

  // -- Sort indicator --

  it('shows sort indicator on sortable columns', () => {
    const { container } = render(Table, {
      props: { columns, data },
    })
    const indicators = container.querySelectorAll('.strand-table__sort-indicator')
    expect(indicators.length).toBe(2)
  })

  // -- Sort button aria-label --

  it('sort button has aria-label with column name', () => {
    const { container } = render(Table, {
      props: { columns, data },
    })
    const sortButtons = container.querySelectorAll('.strand-table__sort-btn')
    expect(sortButtons[0]).toHaveAttribute('aria-label', 'Sort by Name')
    expect(sortButtons[1]).toHaveAttribute('aria-label', 'Sort by Status')
  })
})
