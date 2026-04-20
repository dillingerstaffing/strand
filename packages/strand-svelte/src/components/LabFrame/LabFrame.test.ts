/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import LabFrame from './LabFrame.svelte'
import LabFrameChrome from './LabFrameChrome.svelte'
import LabFrameDot from './LabFrameDot.svelte'
import LabFrameTitle from './LabFrameTitle.svelte'
import LabFrameBody from './LabFrameBody.svelte'
import LabFrameContent from './LabFrameContent.svelte'
import LabFrameContentHead from './LabFrameContentHead.svelte'
import LabFrameActions from './LabFrameActions.svelte'
import LabFrameOverlay from './LabFrameOverlay.svelte'
import LabFramePanel from './LabFramePanel.svelte'
import LabFramePanelHeader from './LabFramePanelHeader.svelte'
import LabFramePanelTitle from './LabFramePanelTitle.svelte'
import LabFramePanelClose from './LabFramePanelClose.svelte'
import LabFramePanelBody from './LabFramePanelBody.svelte'
import LabFramePanelFooter from './LabFramePanelFooter.svelte'

describe('LabFrame family (Svelte)', () => {
  it('LabFrame base class', () => {
    const { container } = render(LabFrame)
    expect(container.querySelector('.strand-ref-frame')).toBeInTheDocument()
  })

  it('Chrome / Title / Body render', () => {
    expect(render(LabFrameChrome).container.querySelector('.strand-ref-frame__chrome')).toBeInTheDocument()
    expect(render(LabFrameTitle).container.querySelector('span.strand-ref-frame__title')).toBeInTheDocument()
    expect(render(LabFrameBody).container.querySelector('.strand-ref-frame__body')).toBeInTheDocument()
  })

  it('Dot applies inline background', () => {
    const { container } = render(LabFrameDot, { props: { color: '#ff5f57' } })
    const el = container.querySelector('.strand-ref-frame__dot') as HTMLElement
    expect(el.style.background).toBe('rgb(255, 95, 87)')
  })

  it('Content aria-hidden when hidden=true', () => {
    const { container } = render(LabFrameContent, { props: { hidden: true } })
    expect(container.querySelector('.strand-ref-frame__content')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('Content no aria-hidden default', () => {
    const { container } = render(LabFrameContent)
    expect(container.querySelector('.strand-ref-frame__content')?.getAttribute('aria-hidden')).toBeNull()
  })

  it('Overlay + Panel (role=dialog, aria-modal)', () => {
    expect(render(LabFrameOverlay).container.querySelector('.strand-ref-frame__overlay')).toBeInTheDocument()
    const { container } = render(LabFramePanel)
    const panel = container.querySelector('.strand-ref-frame__panel') as HTMLElement
    expect(panel.getAttribute('role')).toBe('dialog')
    expect(panel.getAttribute('aria-modal')).toBe('true')
  })

  it('Panel parts render correct tags', () => {
    expect(render(LabFramePanelHeader).container.querySelector('.strand-ref-frame__panel-header')).toBeInTheDocument()
    expect(render(LabFramePanelTitle).container.querySelector('h2.strand-ref-frame__panel-title')).toBeInTheDocument()
    expect(render(LabFramePanelBody).container.querySelector('.strand-ref-frame__panel-body')).toBeInTheDocument()
    expect(render(LabFramePanelFooter).container.querySelector('.strand-ref-frame__panel-footer')).toBeInTheDocument()
  })

  it('Panel close is a button with default aria-label', () => {
    const { container } = render(LabFramePanelClose)
    const btn = container.querySelector('button.strand-ref-frame__panel-close') as HTMLButtonElement
    expect(btn).toBeInTheDocument()
    expect(btn.type).toBe('button')
    expect(btn.getAttribute('aria-label')).toBe('Close')
  })

  it('ContentHead + Actions render', () => {
    expect(render(LabFrameContentHead).container.querySelector('.strand-ref-frame__content-head')).toBeInTheDocument()
    expect(render(LabFrameActions).container.querySelector('.strand-ref-frame__actions')).toBeInTheDocument()
  })
})
