/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import Tabs from './Tabs.svelte'

const testTabs = [
  { id: 'one', label: 'Tab One' },
  { id: 'two', label: 'Tab Two' },
  { id: 'three', label: 'Tab Three' },
]

describe('Tabs', () => {
  it('renders with tablist role', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'one' } })
    expect(container.querySelector('.strand-tabs')).toBeInTheDocument()
    expect(container.querySelector('[role="tablist"]')).toBeInTheDocument()
  })

  it('renders tab buttons', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'one' } })
    const buttons = container.querySelectorAll('[role="tab"]')
    expect(buttons.length).toBe(3)
    expect(buttons[0]).toHaveTextContent('Tab One')
    expect(buttons[1]).toHaveTextContent('Tab Two')
  })

  it('marks active tab', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'two' } })
    const buttons = container.querySelectorAll('[role="tab"]')
    expect(buttons[0]).toHaveAttribute('aria-selected', 'false')
    expect(buttons[1]).toHaveAttribute('aria-selected', 'true')
    expect(buttons[1]).toHaveClass('strand-tabs__tab--active')
  })

  it('sets tabindex on active and inactive tabs', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'one' } })
    const buttons = container.querySelectorAll('[role="tab"]')
    expect(buttons[0]).toHaveAttribute('tabindex', '0')
    expect(buttons[1]).toHaveAttribute('tabindex', '-1')
  })

  it('renders panels with correct ARIA', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'one' } })
    const panels = container.querySelectorAll('[role="tabpanel"]')
    expect(panels.length).toBe(3)
    expect(panels[0]).toHaveAttribute('aria-labelledby', 'tab-one')
    expect(panels[0]).not.toHaveAttribute('hidden')
    expect(panels[1]).toHaveAttribute('hidden', '')
  })

  it('fires onchange callback on tab click', async () => {
    const onchange = vi.fn()
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'one', onchange } })
    const buttons = container.querySelectorAll('[role="tab"]')
    await fireEvent.click(buttons[1])
    expect(onchange).toHaveBeenCalledWith('two')
  })

  it('sets aria-controls on tabs', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'one' } })
    const buttons = container.querySelectorAll('[role="tab"]')
    expect(buttons[0]).toHaveAttribute('aria-controls', 'panel-one')
    expect(buttons[0]).toHaveAttribute('id', 'tab-one')
  })
})
