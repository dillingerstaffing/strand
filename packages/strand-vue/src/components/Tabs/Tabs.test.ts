/*! Strand Vue | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import Tabs from './Tabs.vue'

const sampleTabs = [
  { id: 'one', label: 'Tab One' },
  { id: 'two', label: 'Tab Two' },
  { id: 'three', label: 'Tab Three' },
]

function renderTabs(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(Tabs, {
    props: {
      tabs: sampleTabs,
      activeTab: 'one',
      ...props,
    },
    slots: {
      'panel-one': '<div>Content One</div>',
      'panel-two': '<div>Content Two</div>',
      'panel-three': '<div>Content Three</div>',
      ...slots,
    },
  })
}

describe('Tabs', () => {
  // -- Structure --

  it('renders tablist role', () => {
    const { getByRole } = renderTabs()
    expect(getByRole('tablist')).toBeTruthy()
  })

  it('renders tab buttons for each tab', () => {
    const { getAllByRole } = renderTabs()
    expect(getAllByRole('tab')).toHaveLength(3)
  })

  // -- Active state --

  it('active tab has aria-selected true', () => {
    const { getAllByRole } = renderTabs()
    const tabs = getAllByRole('tab')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('inactive tabs have aria-selected false', () => {
    const { getAllByRole } = renderTabs()
    const tabs = getAllByRole('tab')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
  })

  it('active tab has tabindex 0, inactive tabs have tabindex -1', () => {
    const { getAllByRole } = renderTabs({ activeTab: 'two' })
    const tabs = getAllByRole('tab')
    expect(tabs[0]).toHaveAttribute('tabindex', '-1')
    expect(tabs[1]).toHaveAttribute('tabindex', '0')
    expect(tabs[2]).toHaveAttribute('tabindex', '-1')
  })

  // -- Interaction --

  it('clicking tab emits change with the tab id', async () => {
    const { getAllByRole, emitted } = renderTabs()
    await fireEvent.click(getAllByRole('tab')[1])
    expect(emitted().change[0]).toEqual(['two'])
  })

  // -- Panels --

  it('active panel is visible', () => {
    const { getByText } = renderTabs()
    expect(getByText('Content One').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden')
  })

  it('inactive panels are hidden', () => {
    const { getByText } = renderTabs()
    expect(getByText('Content Two').closest('[role="tabpanel"]')).toHaveAttribute('hidden')
    expect(getByText('Content Three').closest('[role="tabpanel"]')).toHaveAttribute('hidden')
  })

  it('tabpanel has aria-labelledby pointing to its tab', () => {
    const { getAllByRole } = renderTabs()
    const panels = getAllByRole('tabpanel', { hidden: true })
    expect(panels[0]).toHaveAttribute('aria-labelledby', 'tab-one')
  })

  // -- Keyboard navigation --

  it('ArrowRight moves to next tab', async () => {
    const { getAllByRole, emitted } = renderTabs()
    await fireEvent.keyDown(getAllByRole('tab')[0], { key: 'ArrowRight' })
    expect(emitted().change[0]).toEqual(['two'])
  })

  it('ArrowLeft moves to previous tab', async () => {
    const { getAllByRole, emitted } = renderTabs({ activeTab: 'two' })
    await fireEvent.keyDown(getAllByRole('tab')[1], { key: 'ArrowLeft' })
    expect(emitted().change[0]).toEqual(['one'])
  })

  it('ArrowRight wraps to first tab from last', async () => {
    const { getAllByRole, emitted } = renderTabs({ activeTab: 'three' })
    await fireEvent.keyDown(getAllByRole('tab')[2], { key: 'ArrowRight' })
    expect(emitted().change[0]).toEqual(['one'])
  })

  it('ArrowLeft wraps to last tab from first', async () => {
    const { getAllByRole, emitted } = renderTabs({ activeTab: 'one' })
    await fireEvent.keyDown(getAllByRole('tab')[0], { key: 'ArrowLeft' })
    expect(emitted().change[0]).toEqual(['three'])
  })

  it('Home moves focus to first tab', async () => {
    const { getAllByRole, emitted } = renderTabs({ activeTab: 'three' })
    await fireEvent.keyDown(getAllByRole('tab')[2], { key: 'Home' })
    expect(emitted().change[0]).toEqual(['one'])
  })

  it('End moves focus to last tab', async () => {
    const { getAllByRole, emitted } = renderTabs({ activeTab: 'one' })
    await fireEvent.keyDown(getAllByRole('tab')[0], { key: 'End' })
    expect(emitted().change[0]).toEqual(['three'])
  })

  // -- Tab aria-controls --

  it('tab has aria-controls pointing to panel', () => {
    const { getAllByRole } = renderTabs()
    const tabs = getAllByRole('tab')
    expect(tabs[0]).toHaveAttribute('aria-controls', 'panel-one')
    expect(tabs[1]).toHaveAttribute('aria-controls', 'panel-two')
  })
})
