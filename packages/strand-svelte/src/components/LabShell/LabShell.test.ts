/*! Strand Svelte | MIT License | dillingerstaffing.com */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import LabShell from './LabShell.svelte'
import LabSidebar from './LabSidebar.svelte'
import LabSidebarHead from './LabSidebarHead.svelte'
import LabSidebarScroll from './LabSidebarScroll.svelte'
import LabBrand from './LabBrand.svelte'
import LabBrandMark from './LabBrandMark.svelte'
import LabBrandTitle from './LabBrandTitle.svelte'
import LabBrandSub from './LabBrandSub.svelte'
import LabSidebarGroup from './LabSidebarGroup.svelte'
import LabSidebarGroupLabel from './LabSidebarGroupLabel.svelte'
import LabSidebarGroupList from './LabSidebarGroupList.svelte'
import LabSidebarGroupLink from './LabSidebarGroupLink.svelte'
import LabSidebarGroupDot from './LabSidebarGroupDot.svelte'
import LabMain from './LabMain.svelte'
import LabHeader from './LabHeader.svelte'
import LabHeaderTitle from './LabHeaderTitle.svelte'
import LabHeaderLead from './LabHeaderLead.svelte'
import LabHeaderMeta from './LabHeaderMeta.svelte'
import LabHeaderMetaItem from './LabHeaderMetaItem.svelte'
import LabHeaderMetaLabel from './LabHeaderMetaLabel.svelte'
import LabHeaderMetaValue from './LabHeaderMetaValue.svelte'
import LabTaxonomy from './LabTaxonomy.svelte'
import LabTaxonomyTitle from './LabTaxonomyTitle.svelte'
import LabTaxonomyList from './LabTaxonomyList.svelte'
import LabSection from './LabSection.svelte'
import LabSectionHead from './LabSectionHead.svelte'
import LabSectionHeadNote from './LabSectionHeadNote.svelte'
import LabSectionBody from './LabSectionBody.svelte'
import LabExample from './LabExample.svelte'
import LabExampleMeta from './LabExampleMeta.svelte'
import LabExampleLabel from './LabExampleLabel.svelte'
import LabExampleCode from './LabExampleCode.svelte'
import LabExampleDemo from './LabExampleDemo.svelte'
import LabExampleCaption from './LabExampleCaption.svelte'

describe('LabShell family (Svelte)', () => {
  it('LabShell base class', () => {
    const { container } = render(LabShell)
    expect(container.querySelector('.strand-ref-shell')).toBeInTheDocument()
  })

  it('LabSidebar renders aside', () => {
    const { container } = render(LabSidebar)
    expect(container.querySelector('aside.strand-ref-shell__sidebar')).toBeInTheDocument()
  })

  it('sidebar parts render with scoped classes', () => {
    expect(
      render(LabSidebarHead).container.querySelector('.strand-ref-shell__sidebar-head'),
    ).toBeInTheDocument()
    expect(
      render(LabSidebarScroll).container.querySelector('.strand-ref-shell__sidebar-scroll'),
    ).toBeInTheDocument()
    expect(
      render(LabBrand).container.querySelector('.strand-ref-shell__brand'),
    ).toBeInTheDocument()
    expect(
      render(LabBrandMark).container.querySelector('.strand-ref-shell__brand-mark'),
    ).toBeInTheDocument()
    expect(
      render(LabBrandTitle).container.querySelector('.strand-ref-shell__brand-title'),
    ).toBeInTheDocument()
    expect(
      render(LabBrandSub).container.querySelector('.strand-ref-shell__brand-sub'),
    ).toBeInTheDocument()
    expect(
      render(LabSidebarGroup).container.querySelector('.strand-ref-shell__group'),
    ).toBeInTheDocument()
    expect(
      render(LabSidebarGroupLabel).container.querySelector(
        '.strand-ref-shell__group-label',
      ),
    ).toBeInTheDocument()
    expect(
      render(LabSidebarGroupList).container.querySelector(
        'nav.strand-ref-shell__group-list',
      ),
    ).toBeInTheDocument()
  })

  it('sidebar link renders anchor with dot and href', () => {
    const { container } = render(LabSidebarGroupLink, { props: { href: '#x' } })
    const a = container.querySelector('a.strand-ref-shell__group-link') as HTMLAnchorElement
    expect(a).toBeInTheDocument()
    expect(a.getAttribute('href')).toBe('#x')
    expect(a.querySelector('.strand-ref-shell__group-dot')).toBeInTheDocument()
  })

  it('sidebar dot renders standalone', () => {
    const { container } = render(LabSidebarGroupDot)
    expect(container.querySelector('span.strand-ref-shell__group-dot')).toBeInTheDocument()
  })

  it('LabMain renders main', () => {
    const { container } = render(LabMain)
    expect(container.querySelector('main.strand-ref-shell__main')).toBeInTheDocument()
  })

  it('LabHeader family renders correct tags', () => {
    expect(render(LabHeader).container.querySelector('header.strand-ref-header')).toBeInTheDocument()
    expect(render(LabHeaderTitle).container.querySelector('h1.strand-ref-header__title')).toBeInTheDocument()
    expect(render(LabHeaderLead).container.querySelector('p.strand-ref-header__lead')).toBeInTheDocument()
    expect(render(LabHeaderMeta).container.querySelector('.strand-ref-header__meta')).toBeInTheDocument()
    expect(render(LabHeaderMetaItem).container.querySelector('.strand-ref-header__meta-item')).toBeInTheDocument()
    expect(render(LabHeaderMetaLabel).container.querySelector('span.strand-ref-header__meta-label')).toBeInTheDocument()
    expect(render(LabHeaderMetaValue).container.querySelector('span.strand-ref-header__meta-value')).toBeInTheDocument()
  })

  it('LabTaxonomy family renders correct tags', () => {
    expect(render(LabTaxonomy).container.querySelector('.strand-ref-taxonomy')).toBeInTheDocument()
    expect(render(LabTaxonomyTitle).container.querySelector('span.strand-ref-taxonomy__title')).toBeInTheDocument()
    expect(render(LabTaxonomyList).container.querySelector('dl.strand-ref-taxonomy__list')).toBeInTheDocument()
  })

  it('LabSection family renders correct tags', () => {
    expect(render(LabSection).container.querySelector('section.strand-ref-section')).toBeInTheDocument()
    expect(render(LabSectionHead).container.querySelector('.strand-ref-section__head')).toBeInTheDocument()
    expect(render(LabSectionHeadNote).container.querySelector('span.strand-ref-section__head-note')).toBeInTheDocument()
    expect(render(LabSectionBody).container.querySelector('.strand-ref-section__body')).toBeInTheDocument()
  })

  it('LabExample family renders correct tags', () => {
    expect(render(LabExample).container.querySelector('.strand-ref-example')).toBeInTheDocument()
    expect(render(LabExampleMeta).container.querySelector('.strand-ref-example__meta')).toBeInTheDocument()
    expect(render(LabExampleLabel).container.querySelector('span.strand-ref-example__label')).toBeInTheDocument()
    expect(render(LabExampleCode).container.querySelector('span.strand-ref-example__code')).toBeInTheDocument()
    expect(render(LabExampleDemo).container.querySelector('.strand-ref-example__demo')).toBeInTheDocument()
    expect(render(LabExampleCaption).container.querySelector('p.strand-ref-example__caption')).toBeInTheDocument()
  })

  it('LabExampleDemo applies --pad-none modifier', () => {
    const { container } = render(LabExampleDemo, { props: { padNone: true } })
    expect(container.querySelector('.strand-ref-example__demo')).toHaveClass(
      'strand-ref-example__demo--pad-none',
    )
  })

  it('LabExampleDemo applies --recessed modifier', () => {
    const { container } = render(LabExampleDemo, { props: { recessed: true } })
    expect(container.querySelector('.strand-ref-example__demo')).toHaveClass(
      'strand-ref-example__demo--recessed',
    )
  })
})
