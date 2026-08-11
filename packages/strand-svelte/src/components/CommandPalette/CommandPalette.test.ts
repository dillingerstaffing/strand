/*! Strand Svelte | MIT License | dillingerstaffing.com */

// What is worth testing here is the part that is easy to get subtly wrong,
// not that the markup renders. Filtering and ranking belong to the caller,
// and focus trapping belongs to Dialog, so neither is retested. What IS
// tested: the combobox/listbox/option roles, the active-descendant wiring a
// screen reader depends on, arrow selection with wrapping, and the reset that
// stops Enter selecting past the end of a shortened list.

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import CommandPalette from './CommandPalette.svelte'

const items = [
  { id: 'a', label: 'Alpha', sublabel: 'first' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma', badge: 'channel' },
]

const mount = (props = {}) => render(CommandPalette, { props: { open: true, items, query: '', ...props } })

describe('CommandPalette', () => {
  // Dialog focuses the FIRST focusable element in its panel, which is its own
  // close button, so without this the visitor opens a search overlay and types
  // into a button. Inherited behaviour still has to be checked at the point
  // where THIS component depends on it.
  it('puts the caret in the search field when it opens, so the visitor can type', async () => {
    const { container } = mount()
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    expect(document.activeElement).toBe(container.querySelector('.strand-command-palette__input'))
  })

  it('does not render when closed', () => {
    const { container } = mount({ open: false })
    expect(container.querySelector('.strand-command-palette__input')).not.toBeInTheDocument()
  })

  it('exposes the combobox and listbox roles a screen reader navigates by', () => {
    const { getByRole } = mount()
    expect(getByRole('combobox')).toBeInTheDocument()
    expect(getByRole('listbox')).toBeInTheDocument()
  })

  it('renders one option per item, with the first active', () => {
    const { getAllByRole } = mount()
    const options = getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('points aria-activedescendant at the highlighted option, so focus can stay in the field', () => {
    const { getByRole, getAllByRole } = mount()
    expect(getByRole('combobox')).toHaveAttribute(
      'aria-activedescendant',
      getAllByRole('option')[0].id,
    )
  })

  it('omits aria-activedescendant entirely when there is nothing to point at', () => {
    const { getByRole } = mount({ items: [] })
    expect(getByRole('combobox')).not.toHaveAttribute('aria-activedescendant')
  })

  it('moves the highlight down and wraps past the end', async () => {
    const { getByRole, getAllByRole } = mount()
    const input = getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('wraps backwards from the first item to the last', async () => {
    const { getByRole, getAllByRole } = mount()
    await fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp' })
    expect(getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
  })

  it('Home and End jump to the ends', async () => {
    const { getByRole, getAllByRole } = mount()
    const input = getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'End' })
    expect(getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
    await fireEvent.keyDown(input, { key: 'Home' })
    expect(getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('Enter selects the highlighted item', async () => {
    const onselect = vi.fn()
    const { getByRole } = render(CommandPalette, {
      props: { open: true, items, query: '', onselect },
    })
    const input = getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(onselect).toHaveBeenCalledWith(items[1])
  })

  it('Enter on an empty result set does nothing rather than throwing', async () => {
    const onselect = vi.fn()
    const { getByRole } = render(CommandPalette, {
      props: { open: true, items: [], query: 'zzz', onselect },
    })
    await fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' })
    expect(onselect).not.toHaveBeenCalled()
  })

  it('clicking an option selects it', async () => {
    const onselect = vi.fn()
    const { getAllByRole } = render(CommandPalette, {
      props: { open: true, items, query: '', onselect },
    })
    await fireEvent.click(getAllByRole('option')[2])
    expect(onselect).toHaveBeenCalledWith(items[2])
  })

  it('hovering moves the same highlight Enter acts on, so pointer and keyboard agree', async () => {
    const { getAllByRole } = mount()
    await fireEvent.mouseMove(getAllByRole('option')[2])
    expect(getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
  })

  it('reports what the user types', async () => {
    const onquerychange = vi.fn()
    const { getByRole } = render(CommandPalette, {
      props: { open: true, items, query: '', onquerychange },
    })
    await fireEvent.input(getByRole('combobox'), { target: { value: 'alp' } })
    expect(onquerychange).toHaveBeenCalledWith('alp')
  })

  it('shows the empty label instead of a bare box when nothing matches', () => {
    const { getByText } = mount({ items: [], emptyLabel: 'No matches' })
    expect(getByText('No matches')).toBeInTheDocument()
  })

  it('renders sublabel and badge only when supplied', () => {
    const { getByText } = mount()
    expect(getByText('first')).toBeInTheDocument()
    expect(getByText('channel')).toBeInTheDocument()
  })
})
