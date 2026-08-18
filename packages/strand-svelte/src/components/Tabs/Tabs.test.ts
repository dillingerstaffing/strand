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
    const tabs = container.querySelectorAll('[role="tab"]')
    expect(panels[0]).toHaveAttribute('aria-labelledby', tabs[0].id)
    expect(tabs[0]).toHaveAttribute('aria-controls', panels[0].id)
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

  it('gives two sets of tabs ids that do not collide', () => {
    const a = render(Tabs, { props: { tabs: testTabs, activeTab: 'one' } })
    const b = render(Tabs, { props: { tabs: testTabs, activeTab: 'one' } })
    const ids = [...a.container.querySelectorAll('[role="tab"]'), ...b.container.querySelectorAll('[role="tab"]')].map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('owns the selection when uncontrolled: defaultActiveTab, then whatever is clicked', async () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, defaultActiveTab: 'three' } })
    const tabs = container.querySelectorAll('[role="tab"]')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    await fireEvent.click(tabs[0])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
  })

  it('with manual activation the arrows move focus only', async () => {
    const onchange = vi.fn()
    const { container } = render(Tabs, { props: { tabs: testTabs, activeTab: 'one', activation: 'manual', onchange } })
    const tabs = container.querySelectorAll<HTMLElement>('[role="tab"]')
    await fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tabs[1])
    expect(onchange).not.toHaveBeenCalled()
  })

  it('the instrument variant is a class on the root', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, variant: 'instrument' } })
    expect(container.querySelector('.strand-tabs.strand-tabs--instrument')).toBeInTheDocument()
  })
})
