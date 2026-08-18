/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Table from './Table.svelte'

const testColumns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age' },
  { key: 'role', header: 'Role', sortable: true, width: '200px' },
]

const testData = [
  { name: 'Alice', age: 30, role: 'Engineer' },
  { name: 'Bob', age: 25, role: 'Designer' },
]

describe('Table', () => {
  it('renders with wrapper and table', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    expect(container.querySelector('.strand-table-wrapper')).toBeInTheDocument()
    expect(container.querySelector('.strand-table')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    const headers = container.querySelectorAll('.strand-table__th')
    expect(headers.length).toBe(3)
  })

  it('renders data rows', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    const rows = container.querySelectorAll('.strand-table__row')
    expect(rows.length).toBe(2)
    const cells = rows[0].querySelectorAll('.strand-table__td')
    expect(cells[0]).toHaveTextContent('Alice')
    expect(cells[1]).toHaveTextContent('30')
  })

  it('renders sort button for sortable columns', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    const sortBtns = container.querySelectorAll('.strand-table__sort-btn')
    expect(sortBtns.length).toBe(2)
    expect(sortBtns[0]).toHaveAttribute('aria-label', 'Sort by Name')
  })

  it('does not render sort button for non-sortable columns', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    const headers = container.querySelectorAll('.strand-table__th')
    expect(headers[1].querySelector('.strand-table__sort-btn')).not.toBeInTheDocument()
  })

  it('shows sort indicator', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    const indicator = container.querySelector('.strand-table__sort-indicator')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveAttribute('aria-hidden', 'true')
  })

  it('fires onsort callback with key and direction', async () => {
    const onsort = vi.fn()
    const { container } = render(Table, { props: { columns: testColumns, data: testData, onsort } })
    const sortBtns = container.querySelectorAll('.strand-table__sort-btn')
    await fireEvent.click(sortBtns[0])
    expect(onsort).toHaveBeenCalledWith('name', 'asc')
  })

  it('toggles sort direction on second click', async () => {
    const onsort = vi.fn()
    const { container } = render(Table, { props: { columns: testColumns, data: testData, onsort } })
    const sortBtns = container.querySelectorAll('.strand-table__sort-btn')
    await fireEvent.click(sortBtns[0])
    await fireEvent.click(sortBtns[0])
    expect(onsort).toHaveBeenNthCalledWith(2, 'name', 'desc')
  })

  it('applies column width', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    const headers = container.querySelectorAll('.strand-table__th')
    expect((headers[2] as HTMLElement).style.width).toBe('200px')
  })

  it('has thead and tbody', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    expect(container.querySelector('.strand-table__head')).toBeInTheDocument()
    expect(container.querySelector('.strand-table__body')).toBeInTheDocument()
  })

  it('shows one full-width empty cell when data is empty', () => {
    const { container } = render(Table, { props: { columns: testColumns, data: [], emptyLabel: 'Nothing yet' } })
    const cell = container.querySelector('.strand-table__row--empty td') as HTMLTableCellElement
    expect(cell.colSpan).toBe(testColumns.length)
    expect(cell.textContent).toBe('Nothing yet')
  })

  it('names the table with a visually hidden caption from label, or a visible caption', async () => {
    const { container, rerender } = render(Table, { props: { columns: testColumns, data: [], label: 'People' } })
    const hidden = container.querySelector('caption') as HTMLElement
    expect(hidden.textContent?.trim()).toBe('People')
    expect(hidden.classList.contains('strand-sr-only')).toBe(true)
    await rerender({ columns: testColumns, data: [], caption: 'People' })
    expect((container.querySelector('caption') as HTMLElement).classList.contains('strand-sr-only')).toBe(false)
  })

  it('announces sort state through aria-sort on column headers', async () => {
    const { container } = render(Table, { props: { columns: testColumns, data: testData } })
    const th = container.querySelector('th[aria-sort]') as HTMLElement
    expect(th.getAttribute('aria-sort')).toBe('none')
    expect(th.getAttribute('scope')).toBe('col')
    await fireEvent.click(th.querySelector('button') as HTMLElement)
    expect(th.getAttribute('aria-sort')).toBe('ascending')
    await fireEvent.click(th.querySelector('button') as HTMLElement)
    expect(th.getAttribute('aria-sort')).toBe('descending')
  })

  it('follows a controlled sort prop and reports the next sort', async () => {
    const onsort = vi.fn()
    const { container } = render(Table, {
      props: { columns: testColumns, data: testData, sort: { key: 'name', direction: 'desc' }, onsort },
    })
    const th = container.querySelector('th[aria-sort]') as HTMLElement
    expect(th.getAttribute('aria-sort')).toBe('descending')
    await fireEvent.click(th.querySelector('button') as HTMLElement)
    expect(onsort).toHaveBeenCalledWith('name', 'asc')
    expect(th.getAttribute('aria-sort')).toBe('descending')
  })

  it('renders a cell through the column render function', () => {
    const { container } = render(Table, {
      props: { columns: [{ key: 'name', header: 'Name', render: (row: Record<string, unknown>) => `Dr ${row.name}` }], data: testData },
    })
    expect(container.querySelector('td')?.textContent).toBe('Dr Alice')
  })
})
