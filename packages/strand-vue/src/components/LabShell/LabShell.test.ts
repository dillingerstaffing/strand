import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import LabShell from './LabShell.vue'
import LabSidebar from './LabSidebar.vue'
import LabSidebarHead from './LabSidebarHead.vue'
import LabSidebarScroll from './LabSidebarScroll.vue'
import LabBrand from './LabBrand.vue'
import LabBrandMark from './LabBrandMark.vue'
import LabBrandTitle from './LabBrandTitle.vue'
import LabBrandSub from './LabBrandSub.vue'
import LabSidebarGroup from './LabSidebarGroup.vue'
import LabSidebarGroupLabel from './LabSidebarGroupLabel.vue'
import LabSidebarGroupList from './LabSidebarGroupList.vue'
import LabSidebarGroupLink from './LabSidebarGroupLink.vue'
import LabSidebarGroupDot from './LabSidebarGroupDot.vue'
import LabMain from './LabMain.vue'
import LabHeader from './LabHeader.vue'
import LabHeaderTitle from './LabHeaderTitle.vue'
import LabHeaderLead from './LabHeaderLead.vue'
import LabHeaderMeta from './LabHeaderMeta.vue'
import LabHeaderMetaItem from './LabHeaderMetaItem.vue'
import LabHeaderMetaLabel from './LabHeaderMetaLabel.vue'
import LabHeaderMetaValue from './LabHeaderMetaValue.vue'
import LabTaxonomy from './LabTaxonomy.vue'
import LabTaxonomyTitle from './LabTaxonomyTitle.vue'
import LabTaxonomyList from './LabTaxonomyList.vue'
import LabSection from './LabSection.vue'
import LabSectionHead from './LabSectionHead.vue'
import LabSectionHeadNote from './LabSectionHeadNote.vue'
import LabSectionBody from './LabSectionBody.vue'
import LabExample from './LabExample.vue'
import LabExampleMeta from './LabExampleMeta.vue'
import LabExampleLabel from './LabExampleLabel.vue'
import LabExampleCode from './LabExampleCode.vue'
import LabExampleDemo from './LabExampleDemo.vue'
import LabExampleCaption from './LabExampleCaption.vue'

describe('LabShell family (Vue)', () => {
  it('LabShell renders with base class', () => {
    const { container } = render(LabShell, { slots: { default: 'x' } })
    expect(container.firstElementChild?.className).toContain('strand-ref-shell')
  })

  it('LabSidebar renders an aside', () => {
    const { container } = render(LabSidebar, { slots: { default: 'x' } })
    expect(container.firstElementChild?.tagName).toBe('ASIDE')
    expect(container.firstElementChild?.className).toContain('strand-ref-shell__sidebar')
  })

  it('LabSidebarHead + LabSidebarScroll render with scoped classes', () => {
    const head = render(LabSidebarHead, { slots: { default: 'x' } })
    expect(head.container.firstElementChild?.className).toContain('strand-ref-shell__sidebar-head')
    const scroll = render(LabSidebarScroll, { slots: { default: 'x' } })
    expect(scroll.container.firstElementChild?.className).toContain('strand-ref-shell__sidebar-scroll')
  })

  it('LabBrand + mark + title + sub compose', () => {
    const brand = render(LabBrand, { slots: { default: 'x' } })
    expect(brand.container.firstElementChild?.className).toContain('strand-ref-shell__brand')
    const mark = render(LabBrandMark, { slots: { default: 'x' } })
    expect(mark.container.firstElementChild?.className).toContain('strand-ref-shell__brand-mark')
    const title = render(LabBrandTitle, { slots: { default: 'x' } })
    expect(title.container.firstElementChild?.className).toContain('strand-ref-shell__brand-title')
    const sub = render(LabBrandSub, { slots: { default: 'x' } })
    expect(sub.container.firstElementChild?.className).toContain('strand-ref-shell__brand-sub')
  })

  it('LabSidebarGroup + label + list + link + dot render', () => {
    const group = render(LabSidebarGroup, { slots: { default: 'x' } })
    expect(group.container.firstElementChild?.className).toContain('strand-ref-shell__group')
    const label = render(LabSidebarGroupLabel, { slots: { default: 'x' } })
    expect(label.container.firstElementChild?.className).toContain('strand-ref-shell__group-label')
    const list = render(LabSidebarGroupList, { slots: { default: 'x' } })
    expect(list.container.firstElementChild?.tagName).toBe('NAV')
    expect(list.container.firstElementChild?.className).toContain('strand-ref-shell__group-list')
    const link = render(LabSidebarGroupLink, {
      props: { href: '#typography' },
      slots: { default: 'Typography' },
    })
    const a = link.container.firstElementChild as HTMLAnchorElement
    expect(a.tagName).toBe('A')
    expect(a.getAttribute('href')).toBe('#typography')
    expect(a.className).toContain('strand-ref-shell__group-link')
    expect(a.querySelector('.strand-ref-shell__group-dot')).toBeTruthy()
    const dot = render(LabSidebarGroupDot)
    expect(dot.container.firstElementChild?.tagName).toBe('SPAN')
    expect(dot.container.firstElementChild?.className).toContain('strand-ref-shell__group-dot')
  })

  it('LabMain renders a <main>', () => {
    const { container } = render(LabMain, { slots: { default: 'x' } })
    expect(container.firstElementChild?.tagName).toBe('MAIN')
    expect(container.firstElementChild?.className).toContain('strand-ref-shell__main')
  })

  it('LabHeader family renders correct tags + classes', () => {
    const h = render(LabHeader, { slots: { default: 'x' } })
    expect(h.container.firstElementChild?.tagName).toBe('HEADER')
    const t = render(LabHeaderTitle, { slots: { default: 'x' } })
    expect(t.container.firstElementChild?.tagName).toBe('H1')
    const l = render(LabHeaderLead, { slots: { default: 'x' } })
    expect(l.container.firstElementChild?.tagName).toBe('P')
    const m = render(LabHeaderMeta, { slots: { default: 'x' } })
    expect(m.container.firstElementChild?.className).toContain('strand-ref-header__meta')
    const mi = render(LabHeaderMetaItem, { slots: { default: 'x' } })
    expect(mi.container.firstElementChild?.className).toContain('strand-ref-header__meta-item')
    const ml = render(LabHeaderMetaLabel, { slots: { default: 'x' } })
    expect(ml.container.firstElementChild?.className).toContain('strand-ref-header__meta-label')
    const mv = render(LabHeaderMetaValue, { slots: { default: 'x' } })
    expect(mv.container.firstElementChild?.className).toContain('strand-ref-header__meta-value')
  })

  it('LabTaxonomy family renders correct tags + classes', () => {
    const tx = render(LabTaxonomy, { slots: { default: 'x' } })
    expect(tx.container.firstElementChild?.className).toContain('strand-ref-taxonomy')
    const ti = render(LabTaxonomyTitle, { slots: { default: 'x' } })
    expect(ti.container.firstElementChild?.className).toContain('strand-ref-taxonomy__title')
    const ls = render(LabTaxonomyList, { slots: { default: 'x' } })
    expect(ls.container.firstElementChild?.tagName).toBe('DL')
    expect(ls.container.firstElementChild?.className).toContain('strand-ref-taxonomy__list')
  })

  it('LabSection family renders correct tags + classes', () => {
    const s = render(LabSection, { slots: { default: 'x' } })
    expect(s.container.firstElementChild?.tagName).toBe('SECTION')
    expect(s.container.firstElementChild?.className).toContain('strand-ref-section')
    const sh = render(LabSectionHead, { slots: { default: 'x' } })
    expect(sh.container.firstElementChild?.className).toContain('strand-ref-section__head')
    const shn = render(LabSectionHeadNote, { slots: { default: 'x' } })
    expect(shn.container.firstElementChild?.className).toContain('strand-ref-section__head-note')
    const sb = render(LabSectionBody, { slots: { default: 'x' } })
    expect(sb.container.firstElementChild?.className).toContain('strand-ref-section__body')
  })

  it('LabExample family renders correct classes', () => {
    const e = render(LabExample, { slots: { default: 'x' } })
    expect(e.container.firstElementChild?.className).toContain('strand-ref-example')
    const em = render(LabExampleMeta, { slots: { default: 'x' } })
    expect(em.container.firstElementChild?.className).toContain('strand-ref-example__meta')
    const el = render(LabExampleLabel, { slots: { default: 'x' } })
    expect(el.container.firstElementChild?.className).toContain('strand-ref-example__label')
    const ec = render(LabExampleCode, { slots: { default: 'x' } })
    expect(ec.container.firstElementChild?.className).toContain('strand-ref-example__code')
    const ed = render(LabExampleDemo, { slots: { default: 'x' } })
    expect(ed.container.firstElementChild?.className).toContain('strand-ref-example__demo')
    const ep = render(LabExampleCaption, { slots: { default: 'x' } })
    expect(ep.container.firstElementChild?.tagName).toBe('P')
    expect(ep.container.firstElementChild?.className).toContain('strand-ref-example__caption')
  })

  it('LabExampleDemo padNone adds --pad-none modifier', () => {
    const { container } = render(LabExampleDemo, {
      props: { padNone: true },
      slots: { default: 'x' },
    })
    expect(container.firstElementChild?.className).toContain('strand-ref-example__demo--pad-none')
  })

  it('LabExampleDemo recessed adds --recessed modifier', () => {
    const { container } = render(LabExampleDemo, {
      props: { recessed: true },
      slots: { default: 'x' },
    })
    expect(container.firstElementChild?.className).toContain('strand-ref-example__demo--recessed')
  })
})
