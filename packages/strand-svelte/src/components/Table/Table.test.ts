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
})
