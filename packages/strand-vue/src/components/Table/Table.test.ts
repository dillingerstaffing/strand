/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
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

  it('shows one full-width empty cell when data is empty', () => {
    const { container } = render(Table, {
      props: { columns, data: [], emptyLabel: 'Nothing yet' },
    })
    const cell = container.querySelector('.strand-table__row--empty td') as HTMLTableCellElement
    expect(cell.colSpan).toBe(columns.length)
    expect(cell.textContent).toBe('Nothing yet')
  })

  it('names the table with a visually hidden caption from label, or a visible caption', async () => {
    const { container, rerender } = render(Table, { props: { columns, data: [], label: 'People' } })
    const hidden = container.querySelector('caption') as HTMLElement
    expect(hidden.textContent?.trim()).toBe('People')
    expect(hidden.classList.contains('strand-sr-only')).toBe(true)
    await rerender({ columns, data: [], caption: 'People' })
    const visible = container.querySelector('caption') as HTMLElement
    expect(visible.classList.contains('strand-sr-only')).toBe(false)
  })

  it('announces sort state through aria-sort on column headers', async () => {
    const { container } = render(Table, { props: { columns, data } })
    const th = container.querySelector('th[aria-sort]') as HTMLElement
    expect(th.getAttribute('aria-sort')).toBe('none')
    await fireEvent.click(th.querySelector('button') as HTMLElement)
    expect(th.getAttribute('aria-sort')).toBe('ascending')
    await fireEvent.click(th.querySelector('button') as HTMLElement)
    expect(th.getAttribute('aria-sort')).toBe('descending')
    expect(th.getAttribute('scope')).toBe('col')
  })

  it('follows a controlled sort prop and reports the next sort', async () => {
    const onUpdate = vi.fn()
    const { container } = render(Table, {
      props: { columns, data, sort: { key: 'name', direction: 'desc' }, 'onUpdate:sort': onUpdate },
    })
    const th = container.querySelector('th[aria-sort]') as HTMLElement
    expect(th.getAttribute('aria-sort')).toBe('descending')
    await fireEvent.click(th.querySelector('button') as HTMLElement)
    expect(onUpdate).toHaveBeenCalledWith({ key: 'name', direction: 'asc' })
    expect(th.getAttribute('aria-sort')).toBe('descending')
  })

  it('renders a cell through the column render function', () => {
    const { container } = render(Table, {
      props: { columns: [{ key: 'name', header: 'Name', render: (row: Record<string, unknown>) => `Dr ${row.name}` }], data },
    })
    expect(container.querySelector('td')?.textContent).toBe(`Dr ${data[0].name}`)
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
