/*! Strand Vue | MIT License | dillingerstaffing.com */

// What is worth testing here is the part that is easy to get subtly wrong,
// not that the markup renders. Filtering and ranking belong to the caller,
// and focus trapping belongs to Dialog, so neither is retested. What IS
// tested: the combobox/listbox/option roles, the active-descendant wiring a
// screen reader depends on, arrow selection with wrapping, and the two
// resets that stop Enter selecting nothing.

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import CommandPalette from './CommandPalette.vue'

const items = [
  { id: 'a', label: 'Alpha', sublabel: 'first' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma', badge: 'channel' },
]

const mount = (props = {}) =>
  render(CommandPalette, { props: { open: true, items, query: '', ...props } })

describe('CommandPalette', () => {
  // The comment above says focus trapping belongs to Dialog and is not retested
  // here. That was true and it hid a defect: Dialog focuses the FIRST focusable
  // element in its panel, which is its own close button, so the visitor opened a
  // search overlay and typed into a button. Inherited behaviour still has to be
  // checked at the point where THIS component depends on it.
  it('puts the caret in the search field when it opens, so the visitor can type', async () => {
    const { container } = mount()
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    expect(document.activeElement).toBe(
      container.querySelector('.strand-command-palette__input'),
    )
  })

  it('does not render when closed', () => {
    const { container } = mount({ open: false })
    expect(container.querySelector('.strand-command-palette__input')).toBeNull()
  })

  it('exposes the combobox and listbox roles a screen reader navigates by', () => {
    const { getByRole } = mount()
    expect(getByRole('combobox')).toBeTruthy()
    expect(getByRole('listbox')).toBeTruthy()
    expect(getByRole('listbox').getAttribute('aria-label')).toBe('Search')
  })

  it('renders one option per item, with the first active', () => {
    const { getAllByRole } = mount()
    const options = getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0].getAttribute('aria-selected')).toBe('true')
    expect(options[1].getAttribute('aria-selected')).toBe('false')
  })

  it('points aria-activedescendant at the highlighted option, so focus can stay in the field', () => {
    const { getByRole, getAllByRole } = mount()
    const input = getByRole('combobox')
    const first = getAllByRole('option')[0]
    expect(input.getAttribute('aria-activedescendant')).toBe(first.id)
  })

  it('omits aria-activedescendant entirely when there is nothing to point at', () => {
    const { getByRole } = mount({ items: [] })
    expect(getByRole('combobox').getAttribute('aria-activedescendant')).toBeNull()
  })

  it('moves the highlight down and wraps past the end', async () => {
    const { getByRole, getAllByRole } = mount()
    const input = getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(getAllByRole('option')[1].getAttribute('aria-selected')).toBe('true')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    // Wrapped: the last item is one keypress from the first.
    expect(getAllByRole('option')[0].getAttribute('aria-selected')).toBe('true')
  })

  it('wraps backwards from the first item to the last', async () => {
    const { getByRole, getAllByRole } = mount()
    await fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp' })
    expect(getAllByRole('option')[2].getAttribute('aria-selected')).toBe('true')
  })

  it('Home and End jump to the ends', async () => {
    const { getByRole, getAllByRole } = mount()
    const input = getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'End' })
    expect(getAllByRole('option')[2].getAttribute('aria-selected')).toBe('true')
    await fireEvent.keyDown(input, { key: 'Home' })
    expect(getAllByRole('option')[0].getAttribute('aria-selected')).toBe('true')
  })

  it('Enter selects the highlighted item', async () => {
    const onSelect = vi.fn()
    const { getByRole } = render(CommandPalette, {
      props: { open: true, items, query: '', onSelect },
    })
    const input = getByRole('combobox')
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(items[1])
  })

  it('Enter on an empty result set does nothing rather than throwing', async () => {
    const onSelect = vi.fn()
    const { getByRole } = render(CommandPalette, {
      props: { open: true, items: [], query: 'zzz', onSelect },
    })
    await fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' })
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('clicking an option selects it', async () => {
    const onSelect = vi.fn()
    const { getAllByRole } = render(CommandPalette, {
      props: { open: true, items, query: '', onSelect },
    })
    await fireEvent.click(getAllByRole('option')[2])
    expect(onSelect).toHaveBeenCalledWith(items[2])
  })

  it('hovering moves the same highlight Enter acts on, so pointer and keyboard agree', async () => {
    const { getAllByRole } = mount()
    await fireEvent.mouseMove(getAllByRole('option')[2])
    expect(getAllByRole('option')[2].getAttribute('aria-selected')).toBe('true')
  })

  it('reports what the user types', async () => {
    const onQueryChange = vi.fn()
    const { getByRole } = render(CommandPalette, {
      props: { open: true, items, query: '', onQueryChange },
    })
    await fireEvent.update(getByRole('combobox'), 'alp')
    expect(onQueryChange).toHaveBeenCalledWith('alp')
  })

  it('resets the highlight when the result set changes, so Enter cannot select past the end', async () => {
    const { getByRole, getAllByRole, rerender } = mount()
    await fireEvent.keyDown(getByRole('combobox'), { key: 'End' })
    expect(getAllByRole('option')[2].getAttribute('aria-selected')).toBe('true')
    await rerender({ items: [items[0]] })
    expect(getAllByRole('option')[0].getAttribute('aria-selected')).toBe('true')
  })

  it('shows the empty label instead of a bare box when nothing matches', () => {
    const { getByText } = mount({ items: [], emptyLabel: 'No matches' })
    expect(getByText('No matches')).toBeTruthy()
  })

  it('renders sublabel and badge only when supplied', () => {
    const { getByText, queryByText } = mount()
    expect(getByText('first')).toBeTruthy()
    expect(getByText('channel')).toBeTruthy()
    expect(queryByText('undefined')).toBeNull()
  })
})
