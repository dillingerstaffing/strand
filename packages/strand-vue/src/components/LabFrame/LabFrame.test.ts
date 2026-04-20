import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import LabFrame from './LabFrame.vue'
import LabFrameChrome from './LabFrameChrome.vue'
import LabFrameDot from './LabFrameDot.vue'
import LabFrameTitle from './LabFrameTitle.vue'
import LabFrameBody from './LabFrameBody.vue'
import LabFrameContent from './LabFrameContent.vue'
import LabFrameContentHead from './LabFrameContentHead.vue'
import LabFrameActions from './LabFrameActions.vue'
import LabFrameOverlay from './LabFrameOverlay.vue'
import LabFramePanel from './LabFramePanel.vue'
import LabFramePanelHeader from './LabFramePanelHeader.vue'
import LabFramePanelTitle from './LabFramePanelTitle.vue'
import LabFramePanelClose from './LabFramePanelClose.vue'
import LabFramePanelBody from './LabFramePanelBody.vue'
import LabFramePanelFooter from './LabFramePanelFooter.vue'

describe('LabFrame family (Vue)', () => {
  it('LabFrame base class', () => {
    const { container } = render(LabFrame, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-frame')
  })

  it('Chrome + Title + Body render', () => {
    expect(render(LabFrameChrome, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__chrome')
    expect(render(LabFrameTitle, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__title')
    expect(render(LabFrameBody, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__body')
  })

  it('Dot applies inline background', () => {
    const { container } = render(LabFrameDot, { props: { color: '#ff5f57' } })
    const el = container.firstElementChild as HTMLElement
    expect(el.style.background).toBe('rgb(255, 95, 87)')
  })

  it('Content aria-hidden when hidden prop is true', () => {
    const { container } = render(LabFrameContent, {
      props: { hidden: true },
      slots: { default: 'x' },
    })
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('Content no aria-hidden by default', () => {
    const { container } = render(LabFrameContent, { slots: { default: 'x' } })
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBeNull()
  })

  it('Overlay and Panel render with roles', () => {
    expect(render(LabFrameOverlay, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__overlay')
    const { container } = render(LabFramePanel, { slots: { default: 'x' } })
    const panel = container.firstElementChild as HTMLElement
    expect(panel.className).toContain('strand-ref-frame__panel')
    expect(panel.getAttribute('role')).toBe('dialog')
    expect(panel.getAttribute('aria-modal')).toBe('true')
  })

  it('Panel sub-elements render', () => {
    expect(render(LabFramePanelHeader, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__panel-header')
    const { container } = render(LabFramePanelTitle, { slots: { default: 'x' } })
    expect(container.firstElementChild?.tagName).toBe('H2')
    expect(render(LabFramePanelBody, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__panel-body')
    expect(render(LabFramePanelFooter, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__panel-footer')
  })

  it('Panel close renders button + default aria-label', () => {
    const { container } = render(LabFramePanelClose)
    const btn = container.firstElementChild as HTMLButtonElement
    expect(btn.tagName).toBe('BUTTON')
    expect(btn.type).toBe('button')
    expect(btn.getAttribute('aria-label')).toBe('Close')
  })

  it('Panel close accepts custom ariaLabel and children', () => {
    const { container } = render(LabFramePanelClose, {
      props: { ariaLabel: 'Close dialog' },
      slots: { default: 'x' },
    })
    const btn = container.firstElementChild as HTMLButtonElement
    expect(btn.getAttribute('aria-label')).toBe('Close dialog')
    expect(btn.textContent).toBe('x')
  })

  it('ContentHead + Actions render', () => {
    expect(render(LabFrameContentHead, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__content-head')
    expect(render(LabFrameActions, { slots: { default: 'x' } }).container.firstElementChild?.className).toContain('strand-ref-frame__actions')
  })
})
