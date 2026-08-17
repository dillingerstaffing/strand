# Strand HTML Reference

**This is the CSS-only API for Strand.** Use these classes with any framework (Vue, Svelte, Angular) or plain HTML. No JavaScript required. For design constraints, token roles, interaction patterns, and principles, read [DESIGN_LANGUAGE.md](../docs/design-language.md).

> **Using Bulma, Bootstrap, or Tailwind?** Strand's CSS classes are prefixed with `strand-` and have zero collisions with other CSS frameworks. Load Strand CSS alongside your existing framework and use these classes directly.

> **Before writing any Strand HTML**, read [DESIGN_LANGUAGE.md Part II: Named Principles (L57-L193)](../docs/design-language.md#L57). These 10 principles are hard constraints, not guidelines. Violating them produces valid HTML that looks wrong.

> **Principle 1 (Cognitive Economy):** Every element must earn its place. Test: remove an element. If the task still works, it was decoration. If you're not adding back 10% of what you delete, you're not deleting enough. See [DL L61-69](../docs/design-language.md#L61).

> **Principle 2 (Biosynthetic Restraint):** Max 12 distinct visual elements per screen. Every composition must have exactly one visually dominant primary element. If all elements have equal visual weight, the composition has no focal point. An instrument without a focal point is a parts bin, not an instrument. See [DL L71-84](../docs/design-language.md#L71).

> **Principle 9 (Typography Carries the Room):** The largest text and smallest text on the same screen must have at least a 3:1 size ratio. Uniform typography is a spreadsheet. Hierarchical typography is an instrument panel. See [DL L165-178](../docs/design-language.md#L165).

---

## Page Recipes

Complete page skeletons demonstrating how Strand components compose into full pages. Copy-paste and customize.

### Marketing Homepage

```html
<nav class="strand-nav strand-nav--glass">...</nav>
<section class="strand-section strand-section--hero-xl">
  <div class="strand-hero-bg">...</div>
  <div class="strand-container">
    <span class="strand-overline strand-overline--accent">Brand</span>
    <h1 class="strand-headline--gradient">Headline</h1>
    <p class="strand-lead">Description</p>
    <div class="strand-stack strand-stack--horizontal strand-stack--justify-center strand-stack--gap-4">
      <a class="strand-btn strand-btn--primary strand-btn--lg">Primary CTA</a>
      <a class="strand-btn strand-btn--secondary strand-btn--lg">Secondary CTA</a>
    </div>
  </div>
</section>
<hr class="strand-divider strand-divider--horizontal strand-divider--gradient">
<section class="strand-section strand-section--standard">
  <div class="strand-container">
    <div class="strand-section-header strand-container strand-container--default strand-text-center">
      <span class="strand-overline">Section Label</span>
      <h2>Section Heading</h2>
      <p class="strand-lead">Description</p>
    </div>
    <div class="strand-grid strand-grid--auto-md strand-grid--gap-6">
      <div class="strand-card strand-card--interactive strand-card--pad-lg">...</div>
    </div>
  </div>
</section>
<footer class="strand-footer">...</footer>
```

### Dashboard

A dashboard is an **analytical readout panel** (Principle 10). Use `strand-section--compact`, never `--hero` or `--standard`. Get the user to data immediately.

**Section headers:** Wrap overline + heading + lead in `strand-section-header strand-text-center` so all three share the same alignment.

**Card hierarchy (Principle 2):** Every grid must have one visually dominant element. Use card variants, padding tiers, or spatial separation to create a focal point. A grid where every card is identical is a parts bin, not an instrument.

**Table cells:** The Table component renders any value type, including JSX. Pass `<StatusChip>`, `<Tag>`, `<Badge>`, or `<Progress>` as cell values for visual differentiation.

**Button variant selection:** One primary button per page. Supporting actions (deploy, export, filter) use `--secondary` or `--ghost`. If the primary content is a table or data grid, the table is the focal point — buttons subordinate to it.

```html
<nav class="strand-nav strand-nav--glass">...</nav>
<!-- compact section: dashboard data above the fold -->
<section class="strand-section strand-section--compact">
  <div class="strand-container strand-container--full">
    <div class="strand-section-header strand-text-center">
      <span class="strand-overline strand-overline--accent">Operations</span>
      <h1 class="strand-headline strand-headline--lg">Dashboard</h1>
      <p class="strand-lead">System status and agent telemetry.</p>
    </div>
    <!-- metric cards -->
    <div class="strand-grid strand-grid--cols-4 strand-grid--gap-6">
      <div class="strand-card strand-card--elevated strand-card--pad-md">
        <div class="strand-data-readout strand-data-readout--lg">
          <span class="strand-data-readout__label">Active</span>
          <span class="strand-data-readout__value">4</span>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- recessed section: tabs with detail views -->
<section class="strand-section strand-section--standard strand-section--bg-recessed">
  <div class="strand-container strand-container--full">
    <!-- focal hierarchy: alert card at top for attention, then grid -->
    <div class="strand-card strand-card--outlined strand-card--pad-md">
      <!-- featured / error agent gets its own card, above the grid -->
    </div>
    <div class="strand-grid strand-grid--cols-3 strand-grid--gap-6">
      <!-- remaining agents in equal grid below -->
    </div>
    <!-- table with rich cells -->
    <div class="strand-card strand-card--elevated strand-card--pad-none">
      <!-- pass JSX into Table data for status column:
           { status: <span class="strand-status-chip strand-status-chip--live">Active</span> }
      -->
    </div>
    <!-- bar chart with size modifier -->
    <div class="strand-bar-chart strand-bar-chart--md">...</div>
  </div>
</section>
```

### Form Page

```html
<section class="strand-section strand-section--standard strand-section--bg-recessed strand-section--scroll-target">
  <div class="strand-container strand-container--default">
    <div class="strand-section-header strand-text-center">
      <h2>Form Title</h2>
      <p class="strand-lead">Description</p>
    </div>
    <div class="strand-form-grid">
      <div class="strand-form-row">
        <div class="strand-form-field">
          <label class="strand-form-field__label">Name</label>
          <div class="strand-input"><input class="strand-input__field"></div>
        </div>
        <div class="strand-form-field">
          <label class="strand-form-field__label">Email</label>
          <div class="strand-input"><input class="strand-input__field" type="email"></div>
        </div>
      </div>
      <button class="strand-btn strand-btn--primary strand-btn--md strand-full-width">Submit</button>
    </div>
  </div>
</section>
```

---

## Required CSS

**CDN (no install):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@0.5/css/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@0.5/css/reset.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand@0.5/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dillingerstaffing/strand-ui@0.5/dist/css/strand-ui.css">
```

**npm:**

```html
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand-ui/dist/css/strand-ui.css">
```

> **Principle 7 (Grain of Precision):** Include reset.css and base.css for the laboratory surface texture (dot grid, LED glow, grain). Without these, the page is a blank canvas, not a lab. See [DL L141-147](../docs/design-language.md#L141).

> **Token roles:** Don't guess which token to use. See [DESIGN_LANGUAGE.md 3.8: Color Roles (L290-L311)](../docs/design-language.md#L290) for which color in which context, and [Appendix B: Token Quick Reference (L1372-L1431)](../docs/design-language.md#L1372) for the full lookup table.

## Vanilla Runtime (optional)

Load `vanilla/strand-ui.js` as `async` to keep it off the DOMContentLoaded critical path:

```html
<script src="node_modules/@dillingerstaffing/strand-ui/dist/vanilla/strand-ui.js" async></script>
```

The runtime hydrates copy buttons, reveal-on-scroll, and progressive scroll behaviors. Nothing in it is required for first paint, so blocking page load to fetch and parse it costs DCL/TBT for zero visible benefit. Use `async` (not `defer`, not sync) so the browser can render and fire DOMContentLoaded before the script lands.

## Presentation Mode

Wrap static previews in `.strand-static` to render at full visual fidelity without interaction:

```html
<div class="strand-static">
  <button class="strand-btn strand-btn--primary strand-btn--md" disabled>
    <span class="strand-btn__content">Submit</span>
  </button>
</div>
```

The `disabled` attribute prevents interaction. `.strand-static` overrides the disabled visual styling so components appear at full opacity. All transitions and animations are also suppressed inside `.strand-static`.

## Recessed Viewport

Use `.strand-viewport` for component previews and showcase containers:

```html
<div class="strand-viewport strand-static">
  <!-- component previews here -->
</div>

<!-- Flex layout for side-by-side component demos -->
<div class="strand-viewport strand-viewport--flex strand-static">
  <button class="strand-btn strand-btn--primary strand-btn--md" disabled>Primary</button>
  <button class="strand-btn strand-btn--secondary strand-btn--md" disabled>Secondary</button>
</div>

<!-- Column layout for stacked component demos -->
<div class="strand-viewport strand-viewport--flex-col strand-static">
  <!-- vertically stacked previews -->
</div>
```

**Modifiers:** `strand-viewport--flex` (flex, center-aligned, gap-4, wrap) | `strand-viewport--flex-col` (flex-column, gap-4)

> **Why recessed?** See [DESIGN_LANGUAGE.md 7.3: The Recessed Viewport (L710-L725)](../docs/design-language.md#L710) and [7.2: Container Elevation Contexts (L698-L708)](../docs/design-language.md#L698).

## Padding Tiers

> Tier values, usage guidance, and the 30% validation test: [DESIGN_LANGUAGE.md 5.2: Component Padding Tiers (L434-L444)](../docs/design-language.md#L434). Spacing hierarchy rule (gap > padding): [5.3: Spacing Hierarchy (L446-L456)](../docs/design-language.md#L446).

Card padding tiers (used via `strand-card--pad-{sm|md|lg}`):
- `sm`: 16px -- `md`: 24px -- `lg`: 40px

## Focus States

> Full specification: [DESIGN_LANGUAGE.md 14.3: Focus Indicators (L1145-L1151)](../docs/design-language.md#L1145). Always `:focus-visible`, never all `:focus`.

No additional classes needed. Focus rings are built into each component's CSS.

## Boundary Integrity

> Full specification: [DESIGN_LANGUAGE.md 10.4: Boundary Integrity (L865-L871)](../docs/design-language.md#L865). Composability depth rule: [10.5: Composability Constraint (L873-L877)](../docs/design-language.md#L873).

All container components (Grid, Stack, Card, Container) enforce boundary integrity via `overflow: hidden`, `max-width: 100%`, and `min-width: 0` on children. You do not need to add these yourself.

---

<!-- GENERATED:COMPONENT-REFERENCE:START -->
### ActionDock

A bottom-anchored region carrying the primary action of a view, placed where a thumb rests. Implements design-language.md 14.8 (target position): 14.7 makes a target hittable, this makes it reachable. Flip data-strand-actiondock to "visible" when the in-flow control it stands in for scrolls out of view; that attribute is the whole runtime, and there is no JavaScript in this primitive. Use it for the ONE action a view exists to produce, and never alongside the real control, which would be two live buttons for one action.

| Class | Type | Description |
|---|---|---|
| `strand-actiondock` | base | Dock root. Fixed to the viewport's bottom edge and spanning the inline axis, so its position is a function of the viewport and no amount of scrolling moves it out of reach. Carries the safe-area inset so the control clears the home indicator on a notched phone. |

**Usage:**

```html
<!-- Hidden by default: an absent attribute means hidden, so a server-rendered
     page that never flips it occludes nothing. -->
<div class="strand-actiondock" data-strand-actiondock="hidden">
  <button class="strand-btn strand-btn--primary" type="button">RSVP</button>
</div>

<!-- Show it only while the real control is off screen, usually driven by an
     IntersectionObserver on that control. -->
<div class="strand-actiondock" data-strand-actiondock="visible" aria-hidden="true">
  <button class="strand-btn strand-btn--primary" type="button" tabindex="-1">RSVP</button>
</div>

<!-- The docked control usually duplicates one already in the accessibility
     tree, so aria-hidden plus tabindex="-1" avoids a duplicate announcement
     and a duplicate tab stop. Reach is a thumb problem; a keyboard user
     reaches the in-flow control by tabbing. A dock carrying an action with NO
     in-flow equivalent must be exposed instead. -->
```

---

### Alert

Persistent notification with status variants.

| Class | Type | Description |
|---|---|---|
| `strand-alert` | base | Base alert element. |
| `strand-alert__status` | child | Status prefix label. |
| `strand-alert__content` | child | Alert message content. |
| `strand-alert__dismiss` | child | Dismiss button. |
| `strand-alert--info` | modifier | Info status. |
| `strand-alert--success` | modifier | Success status. |
| `strand-alert--warning` | modifier | Warning status. |
| `strand-alert--error` | modifier | Error status. |
| `strand-alert--stack` | modifier | Stacked layout variant: lays the alert body out in a column (flex-direction:column, align-items:stretch, space-3 gap) for a multi-line confirmation with its own action. Background and prefix-only status color are unchanged. |

**Usage:**

```html
<div class="strand-alert strand-alert--info" role="status">
  <span class="strand-alert__status">INFO</span>
  <div class="strand-alert__content">This is an informational message.</div>
</div>
```

---

### AppShell

The card the whole application sits inside: a bounded frame on the page ground, chrome flush to its edges, corners rounded and children clipped to them. NOT A CONTENT WIDTH, and the naming is the risk: the strand-container tiers are READING MEASURES (640 for prose, 1024 at the widest, because text stops being readable past it), while a frame is a different axis bounded by how wide an application should feel. Use a container INSIDE this, never instead of it. Clipping is the point rather than the width: without it a nav's square top corners overhang the frame's rounded ones, which is visible at exactly the two pixels a reader looks at first. Below md it drops border, radius and shadow, because chrome around content that already fills the viewport draws attention to itself and costs space a phone does not have.

| Class | Type | Description |
|---|---|---|
| `strand-app-shell` | base | Application frame. Max width --strand-frame-max (1440px), a chrome dimension declared beside the nav and tab-bar heights rather than among the content tiers. Uses overflow: clip, NOT hidden: hidden would make the outermost container in the product a scroll container and break every position:sticky element beneath it at once. |
| `strand-tabbar` | base | |

**Usage:**

```html
<div class="strand-app-shell">
  <nav class="strand-nav">...</nav>
  <!-- Reading measures go INSIDE the frame, not instead of it. -->
  <div class="strand-container strand-container--wide">...</div>
</div>
```

---

### Avatar

User or entity representation with image or initials.

| Class | Type | Description |
|---|---|---|
| `strand-avatar` | base | Base avatar element. |
| `strand-avatar__img` | child | Image element inside avatar. |
| `strand-avatar__initials` | child | Initials fallback text. |
| `strand-avatar--sm` | modifier | Small size (32px). |
| `strand-avatar--md` | modifier | Medium size (40px). |
| `strand-avatar--lg` | modifier | Large size (48px). |
| `strand-avatar--xl` | modifier | Extra-large size (64px). |

**Usage:**

```html
<div class="strand-avatar strand-avatar--md" role="img" aria-label="JS">
  <span class="strand-avatar__initials" aria-hidden="true">JS</span>
</div>
```

---

### Badge

Status or count indicator that wraps a child element.

| Class | Type | Description |
|---|---|---|
| `strand-badge` | base | Wrapper element (positions indicator at top-right of child). |
| `strand-badge--inline` | modifier | Standalone inline badge without wrapping a child. |
| `strand-badge__indicator` | child | The indicator element (dot or count pill). |
| `strand-badge--dot` | modifier | 8px circle indicator, no text. |
| `strand-badge--count` | modifier | Pill indicator with number text. |
| `strand-badge--live` | modifier | Pulses the indicator, to say the thing it marks is live rather than merely present. Composes with --dot and any colour. Honours prefers-reduced-motion. |
| `strand-badge--default` | modifier | Default color. |
| `strand-badge--teal` | modifier | Teal color. |
| `strand-badge--blue` | modifier | Blue color. |
| `strand-badge--amber` | modifier | Amber color. |
| `strand-badge--red` | modifier | Red color. |
| `strand-pulse` | base | |

**Usage:**

```html
<span class="strand-badge strand-badge--inline">
  <span class="strand-badge__indicator strand-badge--count strand-badge--blue">5</span>
</span>
```

---

### Banner

Top-of-page notification banner.

| Class | Type | Description |
|---|---|---|
| `strand-banner` | base | Base banner element, fixed to top. |
| `strand-banner__text` | child | Banner message text. |
| `strand-banner__dismiss` | child | Dismiss button. |
| `strand-banner--info` | modifier | Info variant (blue). |
| `strand-banner--warning` | modifier | Warning variant (amber). |
| `strand-banner--critical` | modifier | Critical variant (red). |
| `strand-banner-active` | base | |
| `strand-prose` | base | |

**Usage:**

```html
<div class="strand-banner strand-banner--info">
  <p class="strand-banner__text">Scheduled maintenance tonight.</p>
  <button class="strand-banner__dismiss" aria-label="Dismiss">...</button>
</div>
```

---

### BigMonoTime

An oversized monospace clock readout: the largest element in the rail it sits in, so its figure alignment matters more than its size. tabular-nums is why 06:45 and 11:11 are the same width and a column of times does not ripple. Not DataReadout, which pairs a label with a value and renders them as a unit; this is the value alone at display scale and the surrounding rail supplies the context. Renders <time> when given a machine-readable value and <span> otherwise, because a <time> without datetime asserts an instant that is not there.

| Class | Type | Description |
|---|---|---|
| `strand-big-mono-time` | base | The readout. Mono, semibold, tabular figures, tight tracking to close up mono's loose display-size rhythm without touching the figure advance. |
| `strand-big-mono-time--sm` | modifier | Smaller step. |
| `strand-big-mono-time--lg` | modifier | Larger step. |
| `strand-big-mono-time__sep` | child | Range separator. Quieter than the figures so the eye reads two times rather than one string, and aria-hidden so a screen reader is not read punctuation mid-time. |

**Usage:**

```html
<time class="strand-big-mono-time" datetime="2026-08-13T06:45">06:45</time>

<span class="strand-big-mono-time strand-big-mono-time--lg">06:45<span class="strand-big-mono-time__sep" aria-hidden="true">–</span>08:30</span>
```

---

### Breadcrumb

Hierarchical location indicator.

| Class | Type | Description |
|---|---|---|
| `strand-breadcrumb` | base | Nav wrapper element. |
| `strand-breadcrumb__list` | child | Ordered list of breadcrumb items. |
| `strand-breadcrumb__item` | child | Individual breadcrumb item. |
| `strand-breadcrumb__link` | child | Clickable breadcrumb link. |
| `strand-breadcrumb__separator` | child | Separator between items (aria-hidden). |
| `strand-breadcrumb__current` | child | Current page indicator (aria-current). |
| `strand-breadcrumb--instrument` | modifier | |

**Usage:**

```html
<nav aria-label="Breadcrumb" class="strand-breadcrumb">
  <ol class="strand-breadcrumb__list">
    <li class="strand-breadcrumb__item">
      <a href="/" class="strand-breadcrumb__link">Home</a>
    </li>
  </ol>
</nav>
```

---

### Button

Primary action trigger with variants, sizes, and loading state.

| Class | Type | Description |
|---|---|---|
| `strand-btn` | base | Base button element. |
| `strand-btn__content` | child | Inner content wrapper for label and icon. |
| `strand-btn__spinner` | child | Loading spinner indicator, positioned absolute within the button. |
| `strand-btn--primary` | modifier | Primary variant with blue background. |
| `strand-btn--secondary` | modifier | Secondary variant with outlined style. |
| `strand-btn--ghost` | modifier | Ghost variant with transparent background. |
| `strand-btn--danger` | modifier | Danger variant with red background. |
| `strand-btn--sm` | modifier | Small size with consistent touch target. |
| `strand-btn--md` | modifier | Medium size (default) with consistent touch target. |
| `strand-btn--lg` | modifier | Large size with consistent touch target. |
| `strand-btn--full-width` | modifier | Stretches button to fill parent width. |
| `strand-btn--icon-only` | modifier | Square button for icon-only use. |
| `strand-btn--circular` | modifier | Circular button shape for icon-only buttons. |
| `strand-btn--loading` | modifier | Loading state, disables pointer events and shows spinner. |
| `strand-btn--compact` | modifier | Chrome density for a header row: tighter horizontal padding only. Never shrinks the touch target, and has no effect on strand-btn--icon-only, whose padding is what keeps it square. |

**Usage:**

```html
<button class="strand-btn strand-btn--primary strand-btn--md" type="button">
  <span class="strand-btn__content">Label</span>
</button>
```

---

### CalendarGrid

A month laid out as a well plate: seven columns because a week has seven days, and as many rows as the month needs. Implements the well-plate production (design-language.md Part XI-B 11.10) and 10.6 Bounded Cells. A day is a BOUNDED cell -- its size comes from the structure rather than from its contents, so it declares a capacity and states the rest as a count, never clipping silently and never growing its row. NOT a 5.5 auto-fit grid: those reflow their column count to suit the content, which is right when the columns are a sequence and wrong here, because a week has seven days at every viewport. Keyboard: the ARIA grid pattern (14.5). The whole grid is ONE tab stop with a roving tabindex; arrows move by day and week, Home and End move within the week, PageUp and PageDown change month. A month is four to six weeks long, so a grid that stops when the month is covered CHANGES HEIGHT as the reader pages (six rows for August 2026, five for September, four for February) and moves everything beneath it. Set a fixed row count to hold the page still: that is 6.6.1's space contract and 10.6's argument one level up, and six is the value that never truncates because six is the most rows any month can need.

| Class | Type | Description |
|---|---|---|
| `strand-calendar-grid` | base | Plate root, role="grid". Seven columns as minmax(0, 1fr) rather than 1fr, because a bare 1fr floors at the content's min-content width and one long unbroken word would widen its column and skew the plate. The 1px gap is the rule between cells, drawn by the container's background showing through, so no cell needs a border that would double at every shared edge. |
| `strand-calendar-grid__header` | child | The column-axis row, role="row". display: contents so its cells land in the parent grid's columns while staying a semantic row. |
| `strand-calendar-grid__week` | child | One week, role="row". Also display: contents, for the same reason. |
| `strand-calendar-grid__axis` | child | A column heading, role="columnheader", in the overline pattern (4.7). Pair a visible abbreviation marked aria-hidden with the full weekday name in strand-sr-only: "Mon" read aloud is not a weekday, and abbr is only valid on <th> so it does nothing here. |
| `strand-calendar-grid__day` | child | One well, role="gridcell". Fixed minimum height so every well is the same size and the reader can compare by position. Exactly one day carries tabindex="0"; the rest are -1, per the roving-tabindex pattern, because thirty-one tab stops would make the keyboard path through the page unusable. |
| `strand-calendar-grid__day--adjacent` | child | A leading or trailing day from the neighbouring month. Present because a week does not stop at a month boundary; quieter because it is context rather than content. Its date takes gray-500, not gray-400: a date is text and owes 4.5:1 (14.2b). |
| `strand-calendar-grid__day--today` | child | Today. A ring rather than a fill, so it composes with the selected state instead of fighting it -- a day can be both, and two backgrounds cannot express that. Pair with aria-current="date". |
| `strand-calendar-grid__day--selected` | child | The chosen day. Pair with aria-selected="true". |
| `strand-calendar-grid__date` | child | The day number, monospace with tabular numerals so the column of dates aligns. |
| `strand-calendar-grid__content` | child | The day's items. Cannot expand the cell (10.6): a well past its capacity states a remainder rather than pushing its neighbours down. |
| `strand-calendar-grid__remainder` | child | 10.6's stated remainder, e.g. "+3 more". A count the reader can act on, in place of content they would otherwise never know was there. Sits inside the reserved height rather than on top of it. |
| `strand-calendar-grid--compact` | modifier | Compact density (Part XX). Padding and the cell floor shrink; type sizes and colours do not. |

**Usage:**

```html
<div class="strand-calendar-grid" role="grid" aria-label="August 2026">
  <div class="strand-calendar-grid__header" role="row">
    <span class="strand-calendar-grid__axis" role="columnheader">
      <span aria-hidden="true">Sun</span>
      <span class="strand-sr-only">Sunday</span>
    </span>
    <!-- ...six more... -->
  </div>

  <div class="strand-calendar-grid__week" role="row">
    <!-- Exactly one day in the whole grid carries tabindex="0". -->
    <div class="strand-calendar-grid__day strand-calendar-grid__day--today"
         role="gridcell" tabindex="0" aria-current="date" data-iso="2026-08-12">
      <span class="strand-calendar-grid__date">12</span>
      <div class="strand-calendar-grid__content">...</div>
      <span class="strand-calendar-grid__remainder">+3 more</span>
    </div>
    <!-- ...six more... -->
  </div>
</div>
```

---

### Card

Content container with elevation and padding variants.

| Class | Type | Description |
|---|---|---|
| `strand-card` | base | Base card element with default elevation. |
| `strand-card--elevated` | modifier | Elevated variant (default shadow, same as base). |
| `strand-card--outlined` | modifier | Outlined variant with visible border, no shadow. |
| `strand-card--flat` | modifier | Flat variant with no shadow or border. |
| `strand-card--warm` | modifier | Warm shadow variant for showcase contexts. |
| `strand-card--interactive` | modifier | Clickable card with hover lift and cursor pointer. |
| `strand-card--active` | modifier | Semantic hook for active state. No visual treatment applied. |
| `strand-card--pad-none` | modifier | No padding. |
| `strand-card--pad-sm` | modifier | Small padding (16px). |
| `strand-card--pad-md` | modifier | Medium padding (24px). |
| `strand-card--pad-lg` | modifier | Large padding (32px). |
| `strand-card--pad-xl` | modifier | Extra-large padding (40px). |
| `strand-card__section` | child | BEM element: card-internal row with a top hairline. First child suppresses the top border. Stack inside strand-card--pad-none to compose rows. |
| `strand-card__section--header` | child | BEM modifier: header row layout (baseline, space-between, gap). |
| `strand-card-section` | base | |
| `strand-channel-grid` | base | |
| `strand-channel-title` | base | |
| `strand-channel-description` | base | |
| `strand-channel-next` | base | |
| `strand-channel-next__label` | child | |
| `strand-channel-next__title` | child | |
| `strand-channel-next__when` | child | |
| `strand-channel-signin-hint` | base | |

**Usage:**

```html
<div class="strand-card strand-card--elevated strand-card--pad-md">
  Card content here.
</div>

<div class="strand-card strand-card--pad-none">
  <div class="strand-card__section strand-card__section--header">Title</div>
  <div class="strand-card__section">Body</div>
</div>
```

---

### Checkbox

Binary toggle for multiple selections with custom visual.

| Class | Type | Description |
|---|---|---|
| `strand-checkbox` | base | Label wrapper element. |
| `strand-checkbox__native` | child | Hidden native checkbox input. |
| `strand-checkbox__control` | child | Custom visual control. |
| `strand-checkbox__icon` | child | SVG check/dash icon inside control. |
| `strand-checkbox__label` | child | Text label. |
| `strand-checkbox--checked` | modifier | Checked state. |
| `strand-checkbox--indeterminate` | modifier | Indeterminate state. |
| `strand-checkbox--disabled` | modifier | Disabled state. |
| `strand-checkbox--compact` | modifier | |

**Usage:**

```html
<label class="strand-checkbox strand-checkbox--checked">
  <input type="checkbox" class="strand-checkbox__native" checked>
  <span class="strand-checkbox__control" aria-hidden="true">
    <svg class="strand-checkbox__icon" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
  <span class="strand-checkbox__label">Accept terms</span>
</label>
```

---

### ChipSet

A set of selectable chips that WRAPS in a rail and SCROLLS on a narrow viewport. The overflow behaviour is the component, not a detail of it: wrapping is correct in a desktop rail and wrong at 390, where a filter strip wrapping to three lines pushes the content it filters off the screen. It SCROLLS rather than clipping, because a filter the reader cannot reach is not a filter. SELECTION IS ANNOUNCED, NOT ONLY PAINTED: multi-select uses aria-pressed toggles, single-select uses a radiogroup, because "any of these" and "one of these" are different promises and painting them identically tells a screen reader nothing.

| Class | Type | Description |
|---|---|---|
| `strand-chip-set` | base | The set. role=group for multi-select, role=radiogroup for single. Wraps by default. |
| `strand-chip-set--scroll` | modifier | Never wraps. Pair with strand-scroll-row, which owns everything else about scrolling sideways, so a chip strip and any other scrolling row share one definition. |
| `strand-chip-set__chip` | child | One chip. Selected state is styled from aria-pressed / aria-checked, so the painted state and the announced state cannot drift. 44px minimum block size under a coarse pointer. |

**Usage:**

```html
<div class="strand-chip-set" role="group" aria-label="Interests">
  <button type="button" class="strand-chip-set__chip" aria-pressed="true">Outdoors</button>
  <button type="button" class="strand-chip-set__chip" aria-pressed="false">Making</button>
</div>

<!-- Mobile: one line, scrolls sideways, one choice. -->
<div class="strand-chip-set strand-chip-set--scroll strand-scroll-row" role="radiogroup" aria-label="Filter">
  <button type="button" role="radio" class="strand-chip-set__chip" aria-checked="true">All</button>
</div>
```

---

### CodeBlock

Code snippet display with optional language label.

| Class | Type | Description |
|---|---|---|
| `strand-code-block` | base | Block-level code container. |
| `strand-code-block__label` | child | Language label (monospace uppercase overline). |
| `strand-code-block__pre` | child | Pre-formatted code wrapper. |
| `strand-code-block__copy` | child | Copy-to-clipboard button. |
| `strand-code-block__copy--copied` | child | Copied state for the copy button. |
| `strand-code-block__copy-icon` | child | Icon container in copy button. |
| `strand-code-block__copy-icon--clipboard` | child | Clipboard icon variant. |
| `strand-code-block__copy-icon--check` | child | Check icon variant (shown after copy). |
| `strand-code-inline` | base | Inline code element. |

**Usage:**

```html
<div class="strand-code-block">
  <span class="strand-code-block__label">bash</span>
  <pre class="strand-code-block__pre"><code>npm install @dillingerstaffing/strand</code></pre>
</div>
```

---

### CommandPalette

Search-and-jump overlay. Composes Dialog, so focus trapping, focus restoration, scroll lock and Escape dismissal are inherited. Filtering and ranking belong to the caller.

| Class | Type | Description |
|---|---|---|
| `strand-command-palette` | base | Palette root, applied to the composed Dialog. |
| `strand-command-palette__search` | child | Search row holding the icon and the input. |
| `strand-command-palette__icon` | child | Decorative magnifier, aria-hidden. |
| `strand-command-palette__input` | child | The combobox input. Focus stays here while the highlight moves, via aria-activedescendant. |
| `strand-command-palette__list` | child | Scrollable listbox of results. |
| `strand-command-palette__option` | child | One result row (role=option, tabindex -1). |
| `strand-command-palette__option--active` | child | The highlighted row, the one Enter acts on. Pointer hover and arrow keys drive the same state. |
| `strand-command-palette__label` | child | Primary text of a result. |
| `strand-command-palette__sublabel` | child | Secondary text of a result. |
| `strand-command-palette__badge` | child | Short trailing token, such as a category. |
| `strand-command-palette__empty` | child | Shown instead of a bare box when nothing matches. |

---

### Container

Width constraint with centered content.

| Class | Type | Description |
|---|---|---|
| `strand-container` | base | Base container with auto margins. |
| `strand-container--narrow` | modifier | Max width 640px. |
| `strand-container--default` | modifier | Max width 768px. |
| `strand-container--wide` | modifier | Max width 1024px. |
| `strand-container--full` | modifier | Max width 1280px. |

**Usage:**

```html
<div class="strand-container strand-container--default">
  Centered content.
</div>
```

---

### ContainerScale

Container-width visualizer. Renders proportional horizontal bars (narrow / default / wide / full) against a 0-to-max axis.

| Class | Type | Description |
|---|---|---|
| `strand-container-scale` | base | Vertical stack of scale rows. |
| `strand-container-scale__row` | child | Single row (label + track + caption). |
| `strand-container-scale__label` | child | Row label row (flex baseline space-between). |
| `strand-container-scale__caption` | child | Subtle gray caption text. |
| `strand-container-scale__track` | child | Track surface (22px tall, recessed, hairline border). |
| `strand-container-scale__bar` | child | Proportional bar; width set inline per row. |
| `strand-container-scale__px` | child | Bar pixel label (mono 10px blue-primary). |
| `strand-container-scale__axis` | child | Axis row (flex justify-between, mono 9px). |

**Usage:**

```html
<div class="strand-container-scale">
  <div class="strand-container-scale__row">
    <div class="strand-container-scale__label">
      <code>--strand-container-narrow</code>
      <span class="strand-container-scale__caption">640px</span>
    </div>
    <div class="strand-container-scale__track">
      <div class="strand-container-scale__bar" style="width: 50%;">
        <span class="strand-container-scale__px">640</span>
      </div>
    </div>
  </div>
  <div class="strand-container-scale__axis"><span>0</span><span>1280</span></div>
</div>
```

---

### DataReadout

Monospace metric display with label and value. Sizes are settable per instance via --strand-data-readout-label-size, --strand-data-readout-label-weight and --strand-data-readout-value-size (DL 11.2.1); the modifiers below are the sanctioned ladder.

| Class | Type | Description |
|---|---|---|
| `strand-data-readout` | base | Base readout element. |
| `strand-data-readout__label` | child | Monospace uppercase label. Size from --strand-data-readout-label-size (default text-xs, 11.1px) and weight from --strand-data-readout-label-weight (default weight-medium); the ladder holds both and only a consumer may move them. |
| `strand-data-readout__value` | child | The displayed value. Size from --strand-data-readout-value-size, default text-3xl (39px). |
| `strand-data-readout--sm` | modifier | Small size (value text-xl, 25px). The smallest rung on the ladder. |
| `strand-data-readout--lg` | modifier | Large size (value text-4xl, 49px). |
| `strand-data-readout--xl` | modifier | Extra-large size (value fluid 72-112px). |

**Usage:**

```html
<div class="strand-data-readout">
  <span class="strand-data-readout__label">Revenue</span>
  <span class="strand-data-readout__value">$142,800</span>
</div>

<!-- A labelled FACT rather than an instrument number: both halves at caption
     scale, set on an ancestor so every readout in the group matches. -->
<div class="my-facts" style="--strand-data-readout-label-size:10px;--strand-data-readout-value-size:14px">
  <div class="strand-data-readout">
    <span class="strand-data-readout__label">Channel</span>
    <span class="strand-data-readout__value">Weekly Ship</span>
  </div>
</div>
```

---

### Dialog

Modal overlay with backdrop, panel, and focus trap.

| Class | Type | Description |
|---|---|---|
| `strand-dialog__backdrop` | child | Full-viewport overlay backdrop. |
| `strand-dialog__panel` | child | Dialog panel, centered in the backdrop. Width, radius and edge are token-driven so a consumer sets a value rather than overriding the class: --strand-dialog-inline-size (default min(560px, 100%)), --strand-dialog-radius (default --strand-radius-xl) and --strand-dialog-border (default none). |
| `strand-dialog__panel--align-start` | child | Drops the panel under the reader's gaze instead of centering it, at --strand-dialog-inset-block-start (default 12vh). For a search or command overlay: centered, a fixed-height panel straddles the fold on a short viewport and its input is the last thing the eye reaches. |
| `strand-dialog__panel--pad-none` | child | No inner padding, on the panel and on its body alike, and clips content to the panel's radius. For panels whose children carry their own inset (a query row, a scrolling list). Same semantics as strand-card--pad-none. |
| `strand-dialog__panel--pad-sm` | child | Inner padding at --strand-space-4. |
| `strand-dialog__panel--pad-md` | child | Inner padding at --strand-space-6. |
| `strand-dialog__panel--pad-lg` | child | Inner padding at --strand-space-8. The default, and what the base panel carries. |
| `strand-dialog__panel--pad-xl` | child | Inner padding at --strand-space-10. |
| `strand-dialog__header` | child | Dialog header area. |
| `strand-dialog__title` | child | Dialog title text. |
| `strand-dialog__close` | child | Close button. Omit the element entirely for overlays whose convention has no X (a palette, a command bar); it is absolutely positioned over the panel's top band, so content otherwise has to dodge a control the pattern does not use. Escape and backdrop dismissal are unaffected. |
| `strand-dialog__body` | child | Dialog content area. |
| `strand-dialog__panel--align-end` | child | |

**Usage:**

```html
<div class="strand-dialog__backdrop">
  <div class="strand-dialog__panel" role="dialog" aria-modal="true">
    <div class="strand-dialog__header">
      <h2 class="strand-dialog__title">Confirm</h2>
    </div>
    <button class="strand-dialog__close" aria-label="Close">&times;</button>
    <div class="strand-dialog__body">Content</div>
  </div>
</div>
```

---

### Divider

Visual separator (horizontal or vertical).

| Class | Type | Description |
|---|---|---|
| `strand-divider` | base | Base divider element. |
| `strand-divider--horizontal` | modifier | Horizontal orientation. |
| `strand-divider--vertical` | modifier | Vertical orientation. |
| `strand-divider--gradient` | modifier | Gradient fade effect. |
| `strand-divider--labeled` | modifier | Divider with centered text label. |
| `strand-divider__line` | child | Line segment in labeled divider. |
| `strand-divider__label` | child | Text label in labeled divider. |

**Usage:**

```html
<hr class="strand-divider strand-divider--horizontal" role="separator">
```

---

### FeatureSurface

The second dark surface role (design-language.md 9.3): a single element promoted above the content around it, the one card a view is built on. NOT InstrumentViewport, and the difference is not a shade. That one is blue-abyss and exists for DENSITY (maps, charts, terminal output, where fine marks need the darkest ground). This is blue-midnight and exists for EMPHASIS. 9.3's test: is the darkness carrying data, or carrying emphasis? A view with several feature surfaces has no feature. THE CASCADE IS THE PRIMITIVE, not the background: midnight is about 2.5x lighter than the abyss, so gray-400 (6.99 to 4.36) and teal-vital (7.07 to 4.42) both FAIL as text here while passing there, and the instrument cascade uses the first for overlines and the second for status values. Put the ordinary text primitives inside this and they retint themselves; a bare background utility would hand a consumer the right box and the wrong contents, invisibly.

| Class | Type | Description |
|---|---|---|
| `strand-feature-surface` | base | Feature surface root. Paints blue-midnight with the instrument border and carries a text cascade one rung lighter than the instrument viewport's: overlines and the quiet tier take gray-300 (7.46), secondary text gray-200 (8.98), headlines and values white (11.00), accent overlines blue-indicator (6.44). A meter's fill stays blue-primary, which is a graphical object at 3:1 and correct at 3.34 where it would fail as a word. |
| `strand-feature-surface--pad-none` | modifier | No padding, and clips to the surface radius. Use when the CHILDREN carry the inset: a two-pane card whose divider runs the full card height. Without the clip, a pane laid against a corner squares off the radius. |
| `strand-feature-surface--pad-sm` | modifier | Small padding (16px). |
| `strand-feature-surface--pad-md` | modifier | Medium padding (24px). The default, and the same value the base carries. |
| `strand-feature-surface--pad-lg` | modifier | Large padding (32px). |
| `strand-feature-surface--pad-xl` | modifier | Extra-large padding (40px). |
| `strand-feature-surface .strand-alert` | base | Alerts placed on this surface take the dark wash and an inverted per-variant status colour, mirroring the instrument viewport. Not a class you author; it is the cascade the surface guarantees. |
| `strand-headline` | base | |
| `strand-title` | base | |
| `strand-big-mono-time` | base | |
| `strand-stat-strip__value` | child | |
| `strand-big-mono-time__sep` | child | |
| `strand-stat-strip__label` | child | |
| `strand-stat-strip--bordered` | modifier | |
| `strand-stat-strip__cell` | child | |
| `strand-heading--sm` | modifier | |
| `strand-lead` | base | |
| `strand-heading` | base | |
| `strand-value--positive` | modifier | |
| `strand-value--negative` | modifier | |
| `strand-overline` | base | |
| `strand-overline--accent` | modifier | |
| `strand-text-secondary` | base | |
| `strand-text-secondary--xs` | modifier | |
| `strand-kv__label` | child | |
| `strand-kv__value` | child | |
| `strand-kv__value--status` | child | |
| `strand-status-chip--neutral` | modifier | |

**Usage:**

```html
<article class="strand-feature-surface">
  <span class="strand-overline">Next ship</span>
  <h2 class="strand-title">Ship 042</h2>
  <p class="strand-text-secondary">Thursday, 6:30 PM ET</p>
  <!-- The meter's fill is a graphical object, so blue-primary is right here. -->
  <div class="strand-progress strand-progress--bar"><div class="strand-progress__fill" style="width:60%"></div></div>
</article>

<!-- A split card: the panes carry the inset so the divider runs full height. -->
<article class="strand-feature-surface strand-feature-surface--pad-none">
  <div class="my-split__lead">…</div>
  <div class="my-split__rail">…</div>
</article>
```

---

### FormField

Label + input + hint + error wrapper for form composition.

| Class | Type | Description |
|---|---|---|
| `strand-form-field` | base | Wrapper element. |
| `strand-form-field__label` | child | Field label with monospace uppercase styling. |
| `strand-form-field__control` | child | Control wrapper for any input component. |
| `strand-form-field__hint` | child | Hint text below the control. |
| `strand-form-field__error` | child | Error message (replaces hint in error state). |
| `strand-form-field__required` | child | Required indicator asterisk. |
| `strand-form-field--error` | modifier | Error state modifier. |
| `strand-form-field__success` | child | |

**Usage:**

```html
<div class="strand-form-field">
  <label class="strand-form-field__label" for="email">Email</label>
  <div class="strand-form-field__control">
    <div class="strand-input">
      <input type="email" id="email" class="strand-input__field">
    </div>
  </div>
  <p class="strand-form-field__hint">We will never share your email.</p>
</div>
```

---

### Grid

CSS Grid layout primitive with column and gap utilities.

| Class | Type | Description |
|---|---|---|
| `strand-grid` | base | Base grid container. |
| `strand-grid--cols-2` | modifier | 2-column layout. |
| `strand-grid--cols-3` | modifier | 3-column layout. |
| `strand-grid--cols-4` | modifier | 4-column layout. |
| `strand-grid--auto-sm` | modifier | Auto-fit columns, 200px minimum. |
| `strand-grid--auto-220` | modifier | Auto-fit columns, 220px minimum. |
| `strand-grid--auto-md` | modifier | Auto-fit columns, 280px minimum. |
| `strand-grid--auto-260` | modifier | Auto-fit columns, 260px minimum. |
| `strand-grid--auto-lg` | modifier | Auto-fit columns, 360px minimum. |
| `strand-grid--gap-1` | modifier | Gap: space-1 (4px). |
| `strand-grid--gap-2` | modifier | Gap: space-2 (8px). |
| `strand-grid--gap-3` | modifier | Gap: space-3 (12px). |
| `strand-grid--gap-4` | modifier | Gap: space-4 (16px). |
| `strand-grid--gap-5` | modifier | Gap: space-5 (20px). |
| `strand-grid--gap-6` | modifier | Gap: space-6 (24px). |
| `strand-grid--gap-8` | modifier | Gap: space-8 (32px). |
| `strand-grid--sidebar` | modifier | A fixed 264px rail beside a flexible main track, collapsing to one column below the md breakpoint. Use for a filter rail beside a results area: it is not two equal halves, so --cols-2 is wrong, and the column COUNT is not what should vary, so auto-fit is wrong. The main track is minmax(0, 1fr) rather than 1fr, because a bare 1fr floors at the track's min-content width and one long unbroken string would widen the grid and push the rail off screen; the base rule's min-width:0 handles the ITEM, this handles the TRACK. Put the rail FIRST in the markup: below the breakpoint the regions stack in source order, and a filter met after the results it filters is one the reader has already scrolled past. |
| `strand-grid--split` | modifier | A flexible main track beside a fixed-width panel, collapsing to one column below md. strand-grid--sidebar mirrored: there the fixed track is narrow and on the left, here it is wide and on the right. Panel width is --strand-split-panel (default 600px), a custom property because the known consumers want 600 for a map and 380 for a rail and the shape is identical. Do NOT reach for --cols-2 instead: at 1440 it gives 720/720 where a 1fr/600px split gives 840/600, making the panel 20% wider and the main track 14% narrower than designed. Put the MAIN track first: below the breakpoint the regions stack in source order, and a map or detail panel is what the list is about. |
| `strand-ref-shell` | base | |
| `strand-ref-example` | base | |
| `strand-ref-taxonomy__list` | child | |

**Usage:**

```html
<div class="strand-grid strand-grid--cols-3 strand-grid--gap-4">
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</div>
```

---

### Input

Single-line text entry field with addon support.

| Class | Type | Description |
|---|---|---|
| `strand-input` | base | Wrapper element for the input field. |
| `strand-input__field` | child | The native input element. |
| `strand-input__leading` | child | Leading addon (prefix icon or text). |
| `strand-input__trailing` | child | Trailing addon (suffix icon or text). |
| `strand-input--error` | modifier | Error state with red border. |
| `strand-input--disabled` | modifier | Disabled state. |
| `strand-input--has-leading` | modifier | Wrapper modifier when leading addon is present. |
| `strand-input--has-trailing` | modifier | Wrapper modifier when trailing addon is present. |

**Usage:**

```html
<div class="strand-input">
  <input type="text" class="strand-input__field" placeholder="Enter text">
</div>
```

---

### InstrumentViewport

Dark instrument panel container for data-dense content.

| Class | Type | Description |
|---|---|---|
| `strand-instrument-viewport` | base | Dark viewport surface. |
| `strand-instrument-viewport--grid` | modifier | Grid overlay variant. |
| `strand-instrument-viewport--full-bleed` | modifier | |
| `strand-instrument-viewport__value` | child | |
| `strand-body--instrument` | modifier | |
| `strand-kv__label` | child | |
| `strand-kv__value` | child | |
| `strand-status-chip--neutral` | modifier | |
| `strand-headline` | base | |
| `strand-text-secondary` | base | |
| `strand-text-secondary--xs` | modifier | |
| `strand-overline` | base | |
| `strand-overline--accent` | modifier | |
| `strand-heading` | base | |
| `strand-heading--sm` | modifier | |
| `strand-title` | base | |
| `strand-lead` | base | |
| `strand-value--positive` | modifier | |
| `strand-value--negative` | modifier | |
| `strand-big-mono-time` | base | |
| `strand-stat-strip__value` | child | |
| `strand-big-mono-time__sep` | child | |
| `strand-stat-strip__label` | child | |
| `strand-stat-strip--bordered` | modifier | |
| `strand-stat-strip__cell` | child | |
| `strand-log__time` | child | |
| `strand-bar-chart__label` | child | |
| `strand-log__text` | child | |
| `strand-bar-chart__amount` | child | |
| `strand-kv__value--status` | child | |
| `strand-feature-surface` | base | |
| `strand-detail-panel` | base | |
| `strand-surface-light` | base | |
| `strand-instrument-viewport__label` | child | |
| `strand-instrument-viewport__map` | child | |
| `strand-scanline` | base | |
| `strand-scanline--active` | modifier | |
| `strand-scanline--ambient` | modifier | |
| `strand-viewport-vignette` | base | |
| `strand-coord-readout` | base | |
| `strand-coord-readout__lat` | child | |
| `strand-coord-readout__lng` | child | |
| `strand-search-bar` | base | |
| `strand-search-bar--shifted` | modifier | |
| `strand-search-bar__inner` | child | |
| `strand-search-bar__input` | child | |
| `strand-search-bar__action` | child | |
| `strand-search-bar__action--danger` | child | |
| `strand-search-bar__action--locating` | child | |
| `strand-detail-panel--open` | modifier | |
| `strand-detail-panel__title` | child | |
| `strand-detail-panel__meta` | child | |
| `strand-detail-panel__salary` | child | |
| `strand-detail-panel__cta` | child | |
| `strand-detail-panel__source` | child | |
| `strand-detail-panel__close` | child | |
| `strand-detail-panel__close-text` | child | |
| `strand-detail-panel__close-icon` | child | |
| `strand-detail-panel__company` | child | |
| `strand-detail-panel__location` | child | |
| `strand-map-pin` | base | |
| `strand-map-pin--tech` | modifier | |
| `strand-map-pin--health` | modifier | |
| `strand-map-pin--trades` | modifier | |
| `strand-map-pin--finance` | modifier | |
| `strand-map-pin--highlighted` | modifier | |
| `strand-map-pin--dimmed` | modifier | |
| `strand-cluster-marker` | base | |
| `strand-status-chip--committed` | modifier | |

**Usage:**

```html
<div class="strand-instrument-viewport">
  <!-- Dark data-dense content -->
</div>
```

---

### KvEditorial

Editorial modifier on the strand-kv molecule. Use inside card-metadata contexts for soft sans-serif Blue-midnight values separated by a dashed divider. The default strand-kv stays mono-tabular for instrument readouts.

| Class | Type | Description |
|---|---|---|
| `strand-kv--editorial` | modifier | Editorial modifier on a strand-kv row (card-metadata rendering). |

**Usage:**

```html
<div class="strand-kv strand-kv--editorial">
  <span class="strand-kv__label">Owner</span>
  <span class="strand-kv__value">Dillinger Staffing</span>
</div>
```

---

### LabFrame

Fake in-page window chrome that hosts a modal demo inline. Use on docs pages to show how a dialog appears without taking over the viewport.

| Class | Type | Description |
|---|---|---|
| `strand-ref-frame` | base | Frame container (recessed background, rounded). |
| `strand-ref-frame__chrome` | child | Top chrome bar (traffic-light dots + title). |
| `strand-ref-frame__dot` | child | Traffic-light dot (color set inline per dot). |
| `strand-ref-frame__title` | child | Chrome title (mono 11px gray). |
| `strand-ref-frame__body` | child | Frame body (white surface, relative positioning). |
| `strand-ref-frame__content` | child | Primary content area; [aria-hidden=true] blurs and fades. |
| `strand-ref-frame__content-head` | child | Header container for overline + heading inside content. |
| `strand-ref-frame__actions` | child | Action row inside content (flex, 10px gap). |
| `strand-ref-frame__overlay` | child | Modal backdrop (absolute inset 0, translucent). |
| `strand-ref-frame__panel` | child | Modal panel (white card centered in overlay). |
| `strand-ref-frame__panel-header` | child | Panel header row (title + close button). |
| `strand-ref-frame__panel-title` | child | Panel title (h2 sans 18px medium). |
| `strand-ref-frame__panel-close` | child | Panel close button (28x28, ghost). |
| `strand-ref-frame__panel-body` | child | Panel body paragraph (14px gray-700). |
| `strand-ref-frame__panel-footer` | child | Panel footer row (flex end, recessed bg). |

**Usage:**

```html
<div class="strand-ref-frame">
  <div class="strand-ref-frame__chrome">
    <span class="strand-ref-frame__dot" style="background: #ff5f57"></span>
    <span class="strand-ref-frame__dot" style="background: #febc2e"></span>
    <span class="strand-ref-frame__dot" style="background: #28c840"></span>
    <span class="strand-ref-frame__title">Demo</span>
  </div>
  <div class="strand-ref-frame__body">
    <div class="strand-ref-frame__content" aria-hidden="true">Background content</div>
    <div class="strand-ref-frame__overlay">
      <div class="strand-ref-frame__panel" role="dialog" aria-modal="true">
        <div class="strand-ref-frame__panel-header">
          <h2 class="strand-ref-frame__panel-title">Confirm</h2>
          <button type="button" class="strand-ref-frame__panel-close" aria-label="Close">&times;</button>
        </div>
        <div class="strand-ref-frame__panel-body">Are you sure?</div>
        <div class="strand-ref-frame__panel-footer">...</div>
      </div>
    </div>
  </div>
</div>
```

---

### LabGlassStage

Cinematic glass-surface specimen container. Renders a layered blue/teal gradient backdrop with an embedded frosted-glass panel.

| Class | Type | Description |
|---|---|---|
| `strand-ref-glass-stage` | base | Gradient backdrop (radial + diagonal linear, overflow hidden). |
| `strand-ref-glass-panel` | base | Frosted panel with backdrop-filter, translucent dark bg, hairline border. |

**Usage:**

```html
<div class="strand-ref-glass-stage">
  <div class="strand-ref-glass-panel">Glass content</div>
</div>
```

---

### LabRevealStage

Staggered entry animation specimen. Four lines animate in at 0 / 180 / 360 / 540 ms. Remount the stage (new key/ref) to replay.

| Class | Type | Description |
|---|---|---|
| `strand-ref-reveal-stage` | base | Stage container (vertical stack, 10px gap). |
| `strand-ref-reveal-line` | base | Animated line (nth-child controls delay 0/180/360/540). |

**Usage:**

```html
<div class="strand-ref-reveal-stage">
  <div class="strand-ref-reveal-line">First</div>
  <div class="strand-ref-reveal-line">Second</div>
  <div class="strand-ref-reveal-line">Third</div>
  <div class="strand-ref-reveal-line">Fourth</div>
</div>
```

---

### LabShell

Component-reference page chrome. Named primitive family for a docs-site layout: sticky sidebar + scrollable main + header + section + example blocks. Forty-plus classes map 1:1 to the classic component-lab pattern.

| Class | Type | Description |
|---|---|---|
| `strand-ref-shell` | base | Grid root with sidebar (256px) and main (1fr). |
| `strand-ref-shell__sidebar` | child | Sticky left column with brand + nav groups. |
| `strand-ref-shell__sidebar-head` | child | Fixed top block inside the sidebar (brand + lead). |
| `strand-ref-shell__sidebar-scroll` | child | Scrollable region containing nav groups. |
| `strand-ref-shell__brand` | child | Horizontal brand row (mark + title + sub). |
| `strand-ref-shell__brand-mark` | child | Square brand glyph (36x36 on blue-midnight). |
| `strand-ref-shell__brand-title` | child | Brand title (mono 15px blue-midnight). |
| `strand-ref-shell__brand-sub` | child | Brand subtitle overline (mono 10px uppercase). |
| `strand-ref-shell__group` | child | Sidebar nav group with top hairline separator. |
| `strand-ref-shell__group-label` | child | Nav group label (mono 10px uppercase blue-midnight). |
| `strand-ref-shell__group-list` | child | Nav link list container (flex column, 1px gap). |
| `strand-ref-shell__group-link` | child | Nav link row (dot + label). |
| `strand-ref-shell__group-dot` | child | 4x4 dot indicator inside nav links. |
| `strand-ref-shell__main` | child | Main content column (56px 64px 96px padding, 1120px max). |
| `strand-ref-header` | base | Page header block (title + lead + metrics). |
| `strand-ref-header__title` | child | H1 title (light 40px blue-midnight). |
| `strand-ref-header__lead` | child | Header lead paragraph (20px gray-500). |
| `strand-ref-header__meta` | child | Metrics row (grid, 4 columns auto). |
| `strand-ref-header__meta-item` | child | Metric column (label + value). |
| `strand-ref-header__meta-label` | child | Metric label (mono 10px uppercase). |
| `strand-ref-header__meta-value` | child | Metric value (sans 22px light blue-midnight). |
| `strand-ref-taxonomy` | base | Taxonomy explainer block (recessed card with definition list). |
| `strand-ref-taxonomy__title` | child | Taxonomy overline title. |
| `strand-ref-taxonomy__list` | child | Taxonomy definition list (dl). |
| `strand-ref-section` | base | Section block with bottom hairline + scroll-margin. |
| `strand-ref-section__head` | child | Section head (h2 + note, flex baseline space-between). |
| `strand-ref-section__head-note` | child | Section head note (mono 10px uppercase). |
| `strand-ref-section__body` | child | Section body (vertical stack with 32px gaps). |
| `strand-ref-example` | base | Example row (200px meta + 1fr demo grid). |
| `strand-ref-example__meta` | child | Example meta column. |
| `strand-ref-example__label` | child | Example label (sans 13px blue-midnight). |
| `strand-ref-example__code` | child | Example code snippet (mono 10px gray). |
| `strand-ref-example__demo` | child | Example demo panel (white card, 24px 28px padding, subtle shadow). |
| `strand-ref-example__demo--pad-none` | child | Modifier: remove internal padding + hide overflow. |
| `strand-ref-example__demo--recessed` | child | Modifier: use recessed surface background instead of white. |
| `strand-ref-example__caption` | child | Example caption paragraph below the demo. |
| `strand-ref-shell__nav-scrim` | child | Mobile drawer scrim (covers main, dismisses drawer on tap). Hidden until parent has .is-nav-open at <=1040px. |
| `strand-ref-mobile-trigger` | base | Mobile FAB toggle for the sidebar drawer. Use on a strand-btn (icon-only + circular). Hidden by default; shown only at <=1040px breakpoint. |
| `is-nav-open` | base | State class on the .strand-ref-shell mount; consumer toggles to open the mobile drawer. |
| `strand-handoff-render` | base | |

**Usage:**

```html
<div class="strand-ref-shell" style="--strand-ref-sticky-top: 64px;">
  <aside class="strand-ref-shell__sidebar">...</aside>
  <main class="strand-ref-shell__main">
    <header class="strand-ref-header">
      <h1 class="strand-ref-header__title">Every component, rendered.</h1>
      <p class="strand-ref-header__lead">Reference layout for component docs.</p>
    </header>
    <section class="strand-ref-section" id="typography">
      <div class="strand-ref-section__head"><h2>Typography</h2></div>
      <div class="strand-ref-section__body">
        <div class="strand-ref-example">
          <div class="strand-ref-example__meta">
            <div class="strand-ref-example__label">Headline</div>
            <code class="strand-ref-example__code">strand-headline--xl</code>
          </div>
          <div class="strand-ref-example__demo">...</div>
        </div>
      </div>
    </section>
  </main>
</div>
```

---

### LabTip

Pure-CSS tooltip specimen (not the production Tooltip). Use on docs pages to show the four fixed bubble placements. Supports --pinned for screenshots.

| Class | Type | Description |
|---|---|---|
| `strand-ref-tip` | base | Inline-flex trigger wrapper (hover/focus reveals the bubble). |
| `strand-ref-tip--pinned` | modifier | Pinned modifier: force the bubble to show without hover. |
| `strand-ref-tip__bubble` | child | Tooltip bubble (absolute, mono 11px, blue-midnight surface). |
| `strand-ref-tip__bubble--top` | child | Placement modifier: bubble above the trigger. |
| `strand-ref-tip__bubble--bottom` | child | Placement modifier: bubble below the trigger. |
| `strand-ref-tip__bubble--left` | child | Placement modifier: bubble left of the trigger. |
| `strand-ref-tip__bubble--right` | child | Placement modifier: bubble right of the trigger. |

**Usage:**

```html
<span class="strand-ref-tip">
  <button class="strand-btn strand-btn--secondary strand-btn--sm">Hover me</button>
  <span class="strand-ref-tip__bubble strand-ref-tip__bubble--top" role="tooltip">Above</span>
</span>
```

---

### LabUtilCell

Utility-class demo tiles. A row of cells each pairing a class name + demo + caption on a recessed surface with a dashed demo inset.

| Class | Type | Description |
|---|---|---|
| `strand-ref-util-row` | base | Horizontal row of util cells with wrap. |
| `strand-ref-util-cell` | base | Single util cell (code + demo + caption). |
| `strand-ref-util-cell__code` | child | Class-name code label (mono 10px blue-primary). |
| `strand-ref-util-cell__caption` | child | Caption under the demo (mono 10px gray). |
| `strand-ref-util-cell__demo` | child | Dashed demo area that hosts the content being measured. |
| `strand-ref-util-cell__block` | child | Blue-midnight pill block used inside the demo (shows the effect of the utility). |
| `strand-mt-4` | base | |
| `strand-mx-auto` | base | |

**Usage:**

```html
<div class="strand-ref-util-row">
  <div class="strand-ref-util-cell">
    <span class="strand-ref-util-cell__code">.strand-mt-4</span>
    <div class="strand-ref-util-cell__demo">
      <span class="strand-ref-util-cell__block strand-mt-4">space-4</span>
    </div>
    <span class="strand-ref-util-cell__caption">16px margin-top</span>
  </div>
</div>
```

---

### Link

Inline navigation link with animated underline.

| Class | Type | Description |
|---|---|---|
| `strand-link` | base | Base link with animated underline on hover. |
| `strand-link--cta` | modifier | Call-to-action link with touch-target height. |
| `strand-link--mono` | modifier | Monospace overline-style link for footers. |
| `strand-link--inherit` | modifier | |

**Usage:**

```html
<a href="/about" class="strand-link">About us</a>
```

---

### MapLegend

The category key for an instrument viewport's map. The four sector colours are the only place the Blue Discipline (Part III.4) is relaxed, and 9.3's sector palette says why: multi-category encoding is the instrument's purpose, so the colour is data rather than decoration. An item renders as a button when it filters and a plain row when it does not; a legend that only explains is not interactive, and a button role would promise an action the user cannot take while adding a tab stop per row.

| Class | Type | Description |
|---|---|---|
| `strand-map-legend` | base | Legend root. Sits on the dark instrument cabinet. Hides below 640px, where the map needs every pixel. |
| `strand-map-legend__title` | child | Overline heading for the key. |
| `strand-map-legend__item` | child | One category row. A <button type="button"> when it filters, a <div> when it only explains. |
| `strand-map-legend__dot` | child | The sector swatch. aria-hidden: the label beside it already names the category, so an exposed swatch is a second announcement of the same fact. |
| `strand-map-legend__dot--tech` | child | Technology sector encoding. |
| `strand-map-legend__dot--health` | child | Health sector encoding. |
| `strand-map-legend__dot--trades` | child | Trades sector encoding. |
| `strand-map-legend__dot--finance` | child | Finance sector encoding. |

**Usage:**

```html
<div class="strand-map-legend">
  <div class="strand-map-legend__title">Sectors</div>
  <!-- Filtering row: a real button. -->
  <button type="button" class="strand-map-legend__item">
    <span class="strand-map-legend__dot strand-map-legend__dot--tech" aria-hidden="true"></span>
    Technology
  </button>
  <!-- Explaining row: not interactive, so not a button. -->
  <div class="strand-map-legend__item">
    <span class="strand-map-legend__dot strand-map-legend__dot--health" aria-hidden="true"></span>
    Health
  </div>
</div>
```

---

### MapLoading

The screen that covers an instrument viewport while it boots. Fades out rather than unmounting, so the map beneath is never revealed mid-paint: keep it mounted and toggle the modifier. Default state is VISIBLE, because it covers a booting instrument and a consumer that forgets to drive it should show a loading screen rather than a half-painted map. Caption uses instrument voice (11.7): "Processing", never "Loading...".

| Class | Type | Description |
|---|---|---|
| `strand-map-loading` | base | Full-bleed cover over the viewport. Give it role="status" with aria-live="polite" and aria-busy, so the caption is announced and the state change is not silent for a screen reader. |
| `strand-map-loading--hidden` | modifier | Faded out. The element stays mounted; removing it would cut the opacity transition and reveal the map mid-paint. |
| `strand-map-loading__spinner` | child | Rotating indicator. Decorative, aria-hidden. |
| `strand-map-loading__text` | child | Caption, instrument voice. |
| `strand-map-loading__bar` | child | Sweeping progress bar. Decorative, aria-hidden. |

**Usage:**

```html
<div class="strand-map-loading" role="status" aria-live="polite" aria-busy="true">
  <div class="strand-map-loading__spinner" aria-hidden="true"></div>
  <div class="strand-map-loading__text">Processing</div>
  <div class="strand-map-loading__bar" aria-hidden="true"></div>
</div>

<!-- Booted: add the modifier, do not unmount. -->
<div class="strand-map-loading strand-map-loading--hidden" role="status" aria-live="polite" aria-busy="false">...</div>
```

---

### Nav

Site/app navigation with an optional mobile menu and a glass variant. The bar spans its parent and insets by its own padding; place it inside a Container if you want it held to a reading measure. The hamburger and its panel are opt-out via the mobileMenu prop, which an application shell already carrying its destinations in a persistent region should pass as false (DL 19.1.1). For a CSS-only consumer the equivalent is omitting the hamburger and mobile-menu markup.

| Class | Type | Description |
|---|---|---|
| `strand-nav` | base | Base nav element. |
| `strand-nav__inner` | child | Inner flex layout container. Spans the parent and insets by its own padding (32px, 16px below 480). It carries no max-width and does not centre: 1280 is a content measure and belongs to Container. |
| `strand-nav__logo` | child | Logo/brand area (mono uppercase tracked). |
| `strand-nav__logo--pulse` | child | Animated pulse underline on logo. |
| `strand-nav__items` | child | Navigation links container. |
| `strand-nav__link` | child | Desktop navigation link. |
| `strand-nav__link--active` | child | Active desktop link state. |
| `strand-nav__slot` | child | Right-edge content slot (account, utility). |
| `strand-nav__slot--reserve` | child | Slot with a pinned inline size, so swapping its contents cannot shift the nav. |
| `strand-nav__actions` | child | Actions area. Sizes to its contents rather than shrinking, so a child cannot hang outside it (DL 10.4). Buttons here take the compact nav-chrome density on a fine pointer; outside a Nav, reach the same density with strand-btn--compact. |
| `strand-nav__hamburger` | child | Mobile menu toggle button. Not rendered when the mobileMenu prop is false; omit the markup entirely in a CSS-only consumer. |
| `strand-nav__hamburger-icon` | child | Hamburger icon lines. |
| `strand-nav__mobile-menu` | child | Mobile navigation panel. |
| `strand-nav__mobile-menu--open` | child | Open state for mobile menu. |
| `strand-nav__mobile-link` | child | Mobile navigation link. |
| `strand-nav__mobile-link--active` | child | Active mobile link state. |
| `strand-nav__title` | child | Nav title text. |
| `strand-nav__title-tag` | child | Nav title tag element. |
| `strand-nav--glass` | modifier | Fixed glassmorphic nav with frosted backdrop. |
| `strand-nav--scrolled` | modifier | Scrolled state with subtle shadow. |
| `strand-nav--instrument` | modifier | Instrument viewport nav variant. |

**Usage:**

```html
<nav class="strand-nav" aria-label="Main navigation">
  <div class="strand-nav__inner">
    <div class="strand-nav__logo"><strong>Brand</strong></div>
    <div class="strand-nav__items">
      <a href="/" class="strand-nav__link strand-nav__link--active">Home</a>
    </div>
  </div>
</nav>
```

---

### PersonChip

An initials avatar beside a name, in a pill. Shipped as ONE primitive rather than Avatar + Tag composed by hand, because the pill has to align the circle's optical centre with the name's baseline box and a consumer composing two primitives gets that right only by accident. The initials are DECORATIVE and the circle is aria-hidden: the name beside them is the accessible name, and announcing "MK, Maria Klein" reads the same person twice. A button only when it does something; a strip of thirty non-interactive chips would otherwise be thirty tab stops promising an action that does not exist.

| Class | Type | Description |
|---|---|---|
| `strand-person-chip` | base | The pill. A <span> when it only names someone, a <button> when it opens a profile. |
| `strand-person-chip--action` | modifier | Interactive form: hover and focus affordances. |
| `strand-person-chip__avatar` | child | Initials circle. aria-hidden. blue-deep on blue-wash, not blue-primary: these are letters, so 14.2b makes them text at 4.5:1 rather than a graphical object at 3:1. |
| `strand-person-chip__name` | child | The name, and the accessible name. Truncates on one line: a two-line pill breaks a wrapping strip's rhythm. |

**Usage:**

```html
<span class="strand-person-chip">
  <span class="strand-person-chip__avatar" aria-hidden="true">MK</span>
  <span class="strand-person-chip__name">Maria Klein</span>
</span>
```

---

### Progress

Completion indicator (bar or ring).

| Class | Type | Description |
|---|---|---|
| `strand-progress` | base | Base progress element. |
| `strand-progress--bar` | modifier | Bar variant. |
| `strand-progress--ring` | modifier | Ring (circular) variant. |
| `strand-progress__fill` | child | Fill track element. |
| `strand-progress__ring` | child | SVG ring element. |
| `strand-progress__track` | child | Ring background track. |
| `strand-progress--indeterminate` | modifier | Indeterminate animation state. |
| `strand-progress--sm` | modifier | Small size (bar: 4px, ring: 24px). |
| `strand-progress--md` | modifier | Medium size (bar: 8px, ring: 40px). |
| `strand-progress--lg` | modifier | Large size (bar: 12px, ring: 56px). |

**Usage:**

```html
<div class="strand-progress strand-progress--bar strand-progress--md" role="progressbar"
  aria-valuemin="0" aria-valuemax="100" aria-valuenow="65">
  <div class="strand-progress__fill" style="width: 65%;"></div>
</div>
```

---

### Radio

Single selection from a set with custom dot indicator.

| Class | Type | Description |
|---|---|---|
| `strand-radio` | base | Label wrapper element. |
| `strand-radio__native` | child | Hidden native radio input. |
| `strand-radio__control` | child | Custom visual control. |
| `strand-radio__dot` | child | Inner dot indicator. |
| `strand-radio__label` | child | Text label. |
| `strand-radio--checked` | modifier | Checked state. |
| `strand-radio--disabled` | modifier | Disabled state. |
| `strand-radio--compact` | modifier | |

**Usage:**

```html
<label class="strand-radio strand-radio--checked">
  <input type="radio" class="strand-radio__native" name="group" checked>
  <span class="strand-radio__control" aria-hidden="true">
    <span class="strand-radio__dot"></span>
  </span>
  <span class="strand-radio__label">Option A</span>
</label>
```

---

### Reserve

A region that holds its box while data loads, then cross-fades the placeholder to the content. Implements design-language.md 6.6.1 (the space contract) and 6.6.2 (placeholder to content). Flip data-strand-reserve to "ready" when the data lands, or to "empty" when the answer arrived and there is nothing to show; that attribute is the whole runtime, and there is no JavaScript in this primitive.

| Class | Type | Description |
|---|---|---|
| `strand-reserve` | base | Region root. Places both layers in one grid cell, so the region self-sizes to the taller and the swap cannot move layout. |
| `strand-reserve__placeholder` | child | The waiting layer, usually skeletons. Mark it aria-hidden so assistive tech does not read filler. |
| `strand-reserve__content` | child | The real content. Present and sized from first paint, hidden by opacity rather than absent from the DOM. |

**Usage:**

```html
<!-- Optional per-breakpoint floors, needed only when the placeholder is
     genuinely smaller than what replaces it. Each falls back to the one below. -->
<div class="strand-reserve" data-strand-reserve="pending"
  style="--strand-reserve-h: 42px; --strand-reserve-h-md: 56px;">
  <div class="strand-reserve__placeholder" aria-hidden="true">
    <div class="strand-skeleton strand-skeleton--rectangle strand-skeleton--shimmer"
      style="width: 100%; height: 42px;"></div>
  </div>
  <div class="strand-reserve__content">
    <!-- real content, rendered from the start -->
  </div>
</div>

<!-- Omitting data-strand-reserve entirely shows the content and hides the
     placeholder, so a server-rendered page needs no attribute at all. -->

<!-- Resolve on EVERY path, including failure. data-strand-reserve="empty"
     takes the placeholder OUT OF FLOW and collapses the region; "ready" alone
     cannot, because a hidden placeholder still occupies its grid cell and the
     region would hold its height forever. -->
```

---

### ResultCard

One result in an instrument's results panel. Renders as a <button> when it is selectable and an <article> when it is not: a card that pans a map when clicked is a control and owes the keyboard the same affordance as the mouse, while a card that only displays is not, and a button role would promise otherwise. Pair the active state with aria-current so the highlighted result is announced rather than only tinted.

| Class | Type | Description |
|---|---|---|
| `strand-result-card` | base | Card root, on the dark cabinet. |
| `strand-result-card--active` | modifier | The highlighted result, e.g. the one under the cursor on the map. Pair with aria-current="true". |
| `strand-result-card__title` | child | Primary line. |
| `strand-result-card__company` | child | Secondary line. |
| `strand-result-card__meta` | child | Metadata row. Omit the element entirely when there is no metadata: an empty styled row takes vertical space and draws a border for nothing, in a panel where every row competes for height. |
| `strand-result-card__location` | child | Where the result is. |
| `strand-result-card__salary` | child | A second metadata value. |
| `strand-result-card__badge` | child | Small chip. A badge with no variant keeps the base class alone, never a --undefined modifier that matches no rule. |
| `strand-result-card__badge--remote` | child | Remote tint. |
| `strand-result-card__badge--source` | child | Source tint. |

**Usage:**

```html
<!-- Selectable: a real button, reachable by keyboard. -->
<button type="button" class="strand-result-card strand-result-card--active" aria-current="true">
  <div class="strand-result-card__title">Systems Engineer</div>
  <div class="strand-result-card__company">Acme</div>
  <div class="strand-result-card__meta">
    <span class="strand-result-card__location">Oakland</span>
    <span class="strand-result-card__badge strand-result-card__badge--remote">Remote</span>
  </div>
</button>

<!-- Display only: not a control, so not a button. -->
<article class="strand-result-card">
  <div class="strand-result-card__title">Systems Engineer</div>
</article>
```

---

### ResultsPanel

The list an instrument returns for a query. THREE states, not two, deliberately: a failed request and an empty result are different answers and the user is owed the difference. "0 matches detected" means the instrument ran and found nothing; an error means it did not run. The retry affordance therefore belongs to the error state only, because an empty result is not a failure and there is nothing to retry.

| Class | Type | Description |
|---|---|---|
| `strand-results-panel` | base | Panel root: a labelled <section> on the dark cabinet, fixed left on desktop and a bottom sheet below 768px. Hide it with the hidden attribute so it leaves the accessibility tree rather than sitting invisible. |
| `strand-results-panel__count` | child | The count line, instrument voice. Mark it aria-live="polite" so a screen reader hears the count change when a query re-runs. Polite, never assertive: a count re-announcing on every keystroke of a live search interrupts more than it informs. |
| `strand-results-panel__items` | child | Scrollable list region. Rendered only in the results state. |
| `strand-results-panel__state` | child | The empty or error block, rendered instead of the items. |
| `strand-results-panel__state-title` | child | Heading for the empty or error state. |
| `strand-results-panel__state-hint` | child | Supporting line, e.g. "Adjust parameters and retry". |
| `strand-results-panel__error-link` | child | Retry control. Error state only. |

**Usage:**

```html
<section class="strand-results-panel" aria-label="Results">
  <div class="strand-results-panel__count" aria-live="polite">12 matches detected</div>
  <div class="strand-results-panel__items">...</div>
</section>

<!-- Ran, found nothing. No retry: this is not a failure. -->
<section class="strand-results-panel" aria-label="Results">
  <div class="strand-results-panel__state">
    <div class="strand-results-panel__state-title">0 matches detected</div>
    <div class="strand-results-panel__state-hint">Adjust parameters and retry</div>
  </div>
</section>

<!-- Did not run. Retry belongs here. -->
<section class="strand-results-panel" aria-label="Results">
  <div class="strand-results-panel__state">
    <div class="strand-results-panel__state-title">Process interrupted</div>
    <button type="button" class="strand-results-panel__error-link">Retry sequence</button>
  </div>
</section>
```

---

### ScrollReveal

Scroll-triggered entrance animation.

| Class | Type | Description |
|---|---|---|
| `strand-reveal` | base | Element with scroll-triggered fade-up. |
| `strand-reveal--visible` | modifier | Visible state after scroll trigger. |
| `strand-reveal-group` | base | Group container for staggered reveals. |
| `strand-reveal--manual` | modifier | |
| `strand-reveal-group--manual` | modifier | |

**Usage:**

```html
<div class="strand-reveal">Fades up on scroll</div>

<div class="strand-reveal-group">
  <div class="strand-reveal">Staggers 0ms</div>
  <div class="strand-reveal">Staggers 80ms</div>
</div>
```

---

### SearchField

A search input for page chrome: a fixed-width field on a wide viewport, a full-width bar on a narrow one. Renders its full geometry from first paint with no JavaScript, so it can be server-rendered into a header without moving the page when it hydrates (design-language.md 6.6.1, the space contract). NOT to be confused with strand-search-bar, which is the overlay that floats ON an instrument viewport; that one is absolutely positioned against a map beneath it. Put both presentations in the markup and choose between them with strand-hide-below-md / strand-hide-from-md rather than measuring the viewport in JavaScript, which renders the control a frame late. Width is --strand-search-field-inline-size, defaulting to min(300px, 100%): set a flat width where an intrinsically sized parent must be able to measure the field, or 100% to fill a row.

| Class | Type | Description |
|---|---|---|
| `strand-search-field` | base | Field root. A role="search" landmark laid out as a flex row: icon, input, optional clear control. Fixed at min(300px, 100%) so it cannot breach a narrower parent's padding (10.4). Height is 36px, raised to 44px under a coarse pointer for 14.7. |
| `strand-search-field--full` | modifier | Spans the container instead of holding 300px. The narrow-viewport presentation; differs from the base in exactly one property. |
| `strand-search-field__icon` | child | Leading magnifier, 16px, decorative (aria-hidden). Uses gray-500 rather than the gray-400 a mockup usually specifies: 14.2b puts gray-400 in the fill tier at 2.52:1, below the 3:1 SC 1.4.11 asks of a graphical object. |
| `strand-search-field__input` | child | The control. Transparent and borderless because the wrapper draws the box; min-inline-size 0 so it shrinks inside the flex row rather than pushing the field past its declared width. Give it an accessible name: a placeholder is a hint, not a label. |
| `strand-search-field__clear` | child | Optional clear control. Hidden with the hidden attribute while the field is empty, so it is absent from the accessibility tree and the tab order rather than merely invisible. 24px drawn, 44px hit area under a coarse pointer. |
| `strand-search-bar` | base | |
| `strand-search-bar__action` | child | |

**Usage:**

```html
<!-- Both presentations ship in the markup; CSS picks one at the breakpoint. -->
<form class="strand-search-field strand-hide-below-md" role="search">
  <svg class="strand-search-field__icon" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="1.75" aria-hidden="true" focusable="false">
    <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" />
  </svg>
  <input class="strand-search-field__input" type="search"
         aria-label="Search" placeholder="Search trail runs, pottery, chess">
</form>

<form class="strand-search-field strand-search-field--full strand-hide-from-md" role="search">
  <svg class="strand-search-field__icon" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="1.75" aria-hidden="true" focusable="false">
    <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" />
  </svg>
  <input class="strand-search-field__input" type="search"
         aria-label="Search" placeholder="Search events">
</form>
```

---

### SearchTrigger

A control that LOOKS like a search field and behaves like a button: it opens a search overlay rather than accepting text. Composed on top of strand-search-field, which owns the box, so the two controls cannot drift apart visually. Use this wherever search is palette-driven; use SearchField only where the input itself is the search and the keystrokes have nowhere else to go. Three reasons it is a separate primitive rather than a variant: an input that opens a modal on focus is WCAG 3.2.1 (On Focus); a field the user can type into whose text is handled elsewhere gives one query two homes; and role="search" around a text input promises assistive technology that typing works, which is a false promise if the keystrokes go to an overlay.

| Class | Type | Description |
|---|---|---|
| `strand-search-trigger` | base | Trigger root, a button. Applied ALONGSIDE strand-search-field, which supplies the box; this class adds only the button resets a field's box does not expect. Carries aria-haspopup="dialog". |
| `strand-search-trigger--icon` | modifier | Square icon presentation at --strand-touch-target, for the band of widths where a header has stopped having room for a field but has not yet handed over to a phone layout. The label stays IN the accessibility tree, clipped rather than display:none, because it is the control's accessible name and WCAG 2.5.3 requires it to survive. Reach for this rather than a strand-btn--icon-only, which is not a SearchTrigger and so drops aria-haspopup="dialog" and the shared field identity. |
| `strand-search-trigger__label` | child | Visible standing text, styled as a placeholder and taking the same token as the field's real placeholder. This is ALSO the accessible name: no aria-label override, because WCAG 2.5.3 (Label in Name) requires the accessible name to contain the visible text so a speech-input user saying what they see activates the control. Truncates on one line, since a wrapping label would change the control's height. |
| `strand-search-field` | base | |
| `strand-search-field__icon` | child | |

**Usage:**

```html
<!-- Both presentations ship in the markup; CSS picks one at the breakpoint. -->
<button type="button" class="strand-search-field strand-search-trigger strand-hide-below-md"
        aria-haspopup="dialog" aria-expanded="false" aria-controls="search-palette">
  <svg class="strand-search-field__icon" aria-hidden="true" focusable="false">...</svg>
  <span class="strand-search-trigger__label">Search trail runs, pottery, chess</span>
</button>

<button type="button"
        class="strand-search-field strand-search-field--full strand-search-trigger strand-hide-from-md"
        aria-haspopup="dialog">
  <svg class="strand-search-field__icon" aria-hidden="true" focusable="false">...</svg>
  <span class="strand-search-trigger__label">Search events</span>
</button>
```

---

### Section

Page section with padding, background, and scroll-target variants.

| Class | Type | Description |
|---|---|---|
| `strand-section` | base | Base section element. |
| `strand-section--standard` | modifier | Standard section padding. |
| `strand-section--hero-compact` | modifier | Tighter hero padding for secondary CTA visibility. |
| `strand-section--hero` | modifier | Hero section padding. |
| `strand-section--hero-xl` | modifier | Extra-generous hero padding for marketing pages. |
| `strand-section--compact` | modifier | Compact section padding (space-12). |
| `strand-section--bg-primary` | modifier | Primary surface background. |
| `strand-section--bg-elevated` | modifier | Elevated surface background. |
| `strand-section--bg-recessed` | modifier | Recessed surface background. |
| `strand-section--border-top` | modifier | 1px top border for visual separation. |
| `strand-section--scroll-target` | modifier | Adds scroll-margin-top for anchor offset. |

**Usage:**

```html
<section class="strand-section strand-section--standard strand-section--bg-primary">
  <div class="strand-container strand-container--default">Content</div>
</section>
```

---

### Select

Option selection dropdown with custom arrow.

| Class | Type | Description |
|---|---|---|
| `strand-select` | base | Wrapper element for the select. |
| `strand-select__field` | child | The native select element. |
| `strand-select__arrow` | child | Custom dropdown caret indicator. |
| `strand-select--error` | modifier | Error state. |
| `strand-select--disabled` | modifier | Disabled state. |

**Usage:**

```html
<div class="strand-select">
  <select class="strand-select__field">
    <option value="a">Option A</option>
  </select>
  <span class="strand-select__arrow" aria-hidden="true"></span>
</div>
```

---

### Settle

Fades a region's new state in when the model changes, instead of cutting to it. Implements design-language.md 6.9 (state change) and 6.9.1 (identity is what triggers it). The sibling of Reserve: Reserve holds the BOX while a wait resolves, Settle acknowledges the MOMENT the user's action took effect. It cannot affect layout, deliberately, so a region whose two states differ in size needs Reserve as well. There is no JavaScript in this primitive: a keyframe animation runs when an element enters the DOM.

| Class | Type | Description |
|---|---|---|
| `strand-settle` | base | Fades the element in over --strand-duration-fast when it is inserted. Opacity only, and it declares no size of any kind. Under prefers-reduced-motion the animation is removed and the change is immediate. |
| `strand-settle--modifier` | modifier | |

**Usage:**

```html
<!-- Insertion alone fires the fade, so an item ARRIVING needs nothing else. -->
<li class="strand-settle">a comment that just arrived</li>

<!-- THE TRAP, and the one way to use this and get nothing: a VALUE change
     patches a text node and inserts nothing, so no animation fires. Replace
     the element rather than rewriting its text.
     WRONG, animates nothing however correct the class is:
       el.textContent = count + ' people'
     RIGHT, a new element, so the fade fires:
       const next = document.createElement('span');
       next.className = 'strand-settle';
       next.textContent = count + ' people';
       el.replaceWith(next);
     In a framework this is the key. Key on WHAT THE USER WAS TOLD, not on
     the record carrying it: an optimistic echo and its server confirmation
     are ONE state change, and keying on the row id announces it twice. -->

<!-- Settle never sizes anything. If the two states are different heights,
     that is a space-contract problem: wrap in strand-reserve. -->
```

---

### Skeleton

Content placeholder with shimmer animation.

| Class | Type | Description |
|---|---|---|
| `strand-skeleton` | base | Base skeleton element. |
| `strand-skeleton--text` | modifier | Text placeholder (small radius). |
| `strand-skeleton--rectangle` | modifier | Rectangle placeholder (medium radius). |
| `strand-skeleton--circle` | modifier | Circle placeholder (full radius). |
| `strand-skeleton--shimmer` | modifier | Shimmer animation effect. |

**Usage:**

```html
<div class="strand-skeleton strand-skeleton--text strand-skeleton--shimmer" aria-hidden="true"
  style="width: 100%; height: 1em;"></div>
```

---

### Slider

Range value selection.

| Class | Type | Description |
|---|---|---|
| `strand-slider` | base | Wrapper element. |
| `strand-slider__field` | child | Native range input. |
| `strand-slider--disabled` | modifier | Disabled state. |

**Usage:**

```html
<div class="strand-slider">
  <input type="range" class="strand-slider__field" min="0" max="100" value="50">
</div>
```

---

### Spinner

Loading indicator with accessible text.

| Class | Type | Description |
|---|---|---|
| `strand-spinner` | base | Base spinner element. |
| `strand-spinner__ring` | child | Spinning ring visual. |
| `strand-spinner__sr-only` | child | Screen-reader-only loading text. |
| `strand-spinner--sm` | modifier | Small size (16px). |
| `strand-spinner--md` | modifier | Medium size (20px). |
| `strand-spinner--lg` | modifier | Large size (32px). |

**Usage:**

```html
<span class="strand-spinner strand-spinner--md" role="status">
  <span class="strand-spinner__ring" aria-hidden="true"></span>
  <span class="strand-spinner__sr-only">Loading</span>
</span>
```

---

### Stack

Flex layout primitive with direction, gap, and alignment.

| Class | Type | Description |
|---|---|---|
| `strand-stack` | base | Base flex container. |
| `strand-stack--vertical` | modifier | Column direction. |
| `strand-stack--horizontal` | modifier | Row direction. |
| `strand-stack--align-start` | modifier | Align items to start. |
| `strand-stack--align-center` | modifier | Align items to center. |
| `strand-stack--align-end` | modifier | Align items to end. |
| `strand-stack--justify-start` | modifier | Justify content to start. |
| `strand-stack--justify-center` | modifier | Justify content to center. |
| `strand-stack--justify-end` | modifier | Justify content to end. |
| `strand-stack--justify-between` | modifier | Justify content with space-between. |
| `strand-stack--justify-around` | modifier | Justify content with space-around. |
| `strand-stack--wrap` | modifier | Enable flex wrap. |
| `strand-stack--responsive` | modifier | Collapse horizontal to vertical at 768px. |
| `strand-stack__item--full-mobile` | child | Full-width child on mobile in responsive mode. |
| `strand-stack--gap-0` | modifier | Gap: none. Collapse the stack's spacing where an adjacent element already owns it. |
| `strand-stack--gap-1` | modifier | Gap: space-1 (4px). |
| `strand-stack--gap-2` | modifier | Gap: space-2 (8px). |
| `strand-stack--gap-3` | modifier | Gap: space-3 (12px). |
| `strand-stack--gap-4` | modifier | Gap: space-4 (16px). |
| `strand-stack--gap-5` | modifier | Gap: space-5 (20px). |
| `strand-stack--gap-6` | modifier | Gap: space-6 (24px). |
| `strand-stack--gap-8` | modifier | Gap: space-8 (32px). |
| `strand-stack--gap-10` | modifier | |
| `strand-stack--gap-12` | modifier | |
| `strand-stack--gap-16` | modifier | |
| `strand-stack--gap-20` | modifier | |
| `strand-stack--gap-24` | modifier | |
| `strand-stack--gap-32` | modifier | |
| `strand-stack--gap-40` | modifier | |
| `strand-stack--gap-48` | modifier | |

**Usage:**

```html
<div class="strand-stack strand-stack--vertical strand-stack--gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Header row: title left, actions right. Inside a flex or grid parent,
     a stack shrink-wraps to its content; add strand-full-width so
     justify-between has room to distribute. -->
<div class="strand-stack strand-stack--horizontal strand-stack--gap-4 strand-stack--align-center strand-stack--justify-between strand-full-width">
  <span class="strand-overline strand-overline--accent">Section title</span>
  <div class="strand-stack strand-stack--horizontal strand-stack--gap-2">
    <button class="strand-btn strand-btn--ghost strand-btn--sm"><span class="strand-btn__content">Cancel</span></button>
    <button class="strand-btn strand-btn--primary strand-btn--sm"><span class="strand-btn__content">Save</span></button>
  </div>
</div>
```

---

### StatStrip

A row of labelled value cells, compared across rather than read singly. Not DataReadout, which renders ONE label-and-value pair as a unit with sizes tuned for a single dominant figure; here the cells are peers, so they are equal-width and their values share a baseline. Renders as a description list because that is what it is: a row of divs would give a screen reader six unrelated strings instead of three pairs.

| Class | Type | Description |
|---|---|---|
| `strand-stat-strip` | base | The row, as a <dl>. Equal fractions via minmax(0, 1fr) so a long value cannot widen its own column and break the comparison by position. |
| `strand-stat-strip--bordered` | modifier | Denser panel form: cells gain padding and a hairline rule between them, for a strip that is its own panel rather than a row inside a card. |
| `strand-stat-strip__cell` | child | One cell, wrapping a dt and its dd. The wrapper is what pairs them when several sit side by side; without it the association is only visual. |
| `strand-stat-strip__label` | child | The dt, in the overline pattern. gray-500 rather than the gray-400 a mockup specifies: a label is a word, so 14.2b makes it text at 4.5:1. |
| `strand-stat-strip__value` | child | The dd. Mono with tabular figures; wraps rather than widening its column. |

**Usage:**

```html
<dl class="strand-stat-strip">
  <div class="strand-stat-strip__cell">
    <dt class="strand-stat-strip__label">Group</dt>
    <dd class="strand-stat-strip__value">East Bay</dd>
  </div>
</dl>
```

---

### Swatch

Color swatch specimen for design-token documentation. The swatch grid auto-fills with 160px tiles; each tile sets its own background/color inline (tone-dependent).

| Class | Type | Description |
|---|---|---|
| `strand-swatch-grid` | base | Swatch grid (auto-fill, 160px minimum tiles). |
| `strand-swatch` | base | Single color tile with border + min-height; background/color set inline. |
| `strand-swatch__name` | child | Token name (mono 10px uppercase). |
| `strand-swatch__hex` | child | Hex value (mono 11px, opacity 0.75). |

**Usage:**

```html
<div class="strand-swatch-grid">
  <div class="strand-swatch" style="background: #3B8EF6; color: #fff;">
    <span class="strand-swatch__name">blue-primary</span>
    <span class="strand-swatch__hex">#3B8EF6</span>
  </div>
</div>
```

---

### Switch

Binary toggle (single) with track and thumb.

| Class | Type | Description |
|---|---|---|
| `strand-switch` | base | Label wrapper element. |
| `strand-switch__track` | child | Track button element with role="switch". |
| `strand-switch__thumb` | child | Sliding thumb indicator. |
| `strand-switch__label` | child | Text label. |
| `strand-switch--checked` | modifier | Checked (on) state. |
| `strand-switch--disabled` | modifier | Disabled state. |
| `strand-switch--compact` | modifier | |

**Usage:**

```html
<label class="strand-switch strand-switch--checked">
  <button type="button" role="switch" class="strand-switch__track" aria-checked="true">
    <span class="strand-switch__thumb" aria-hidden="true"></span>
  </button>
  <span class="strand-switch__label">Dark mode</span>
</label>
```

---

### TabBar

The persistent viewport-anchored navigation an application shell takes on a touch viewport. Implements design-language.md 19.1.1, which is the CONDITION selecting between this and the hamburger in 19.1: a content surface collapses to a hamburger, an application shell with three to five top-level destinations anchors them in 14.8's easy band. Read 19.1.1 before using this, because the commonest misuse is a tab bar on a content surface, where it costs 76px of every screen forever. Not Tabs, which switches content panels inside one view (19.3). Not ActionDock, which carries the one ACTION a view produces rather than destinations. 19.1.1 does not forbid the two coexisting; it forbids stacking them into a wall at the bottom of the viewport and requires a surface wanting both to DECIDE which belongs nearer the thumb. Mutually exclusive by state is a legal answer: destinations at rest, the dock taking the band only while a commitment is live, then yielding it back. Paints an OPAQUE ground by default: its labels are small text owing 4.5:1, and behind a translucent bar the effective background is whatever is scrolled underneath, so the ratio would change with scroll position. Geometry is tunable without overriding classes via --strand-tabbar-justify, --strand-tabbar-pad-block-start, --strand-tabbar-pad-inline, --strand-tabbar-item-size, --strand-tabbar-item-gap, --strand-tabbar-label-size and --strand-tabbar-label-tracking; the label token does not add a rung to the type scale, it lets one consumer size one bar.

| Class | Type | Description |
|---|---|---|
| `strand-tabbar` | base | Bar root, a nav landmark. Fixed to the viewport's bottom edge so its position is a function of the viewport and no scroll can move it out of reach, with the safe-area inset so it clears the home indicator on a notched phone. Give it an aria-label; an unnamed nav is one a screen reader user tells apart by guessing. |
| `strand-tabbar__item` | child | One destination. A link when it has a href, so middle-click and open-in-new-tab keep working; a button only when there is genuinely no URL. Minimum 44x44 per 14.7, measured on the item rather than inferred from the bar's height. |
| `strand-tabbar__icon` | child | Decorative glyph, 20px. aria-hidden: the label already names the destination. |
| `strand-tabbar__label` | child | Destination name. text-xs with wider tracking, uppercase mono. Wraps rather than truncating, because a destination the user cannot read is not a destination; if a label does not fit, the surface has too many destinations and 19.1.1's count test already refuses it. |
| `strand-actiondock` | base | |

**Usage:**

```html
<!-- The current destination is marked with aria-current="page", which is
     BOTH the announced state and the styling hook, so the two cannot drift. -->
<nav class="strand-tabbar" aria-label="Primary">
  <a class="strand-tabbar__item" href="/discover" aria-current="page">
    <span class="strand-tabbar__icon" aria-hidden="true"><svg>...</svg></span>
    <span class="strand-tabbar__label">Discover</span>
  </a>
  <a class="strand-tabbar__item" href="/calendar">
    <span class="strand-tabbar__label">Calendar</span>
  </a>
</nav>

<!-- Reserve the space the bar occupies on the SCROLLING CONTENT, or the last
     item of every list sits permanently underneath the navigation. -->
<main class="strand-tabbar-offset">...</main>
```

---

### Table

Tabular data display with sortable headers.

| Class | Type | Description |
|---|---|---|
| `strand-table-wrapper` | base | Responsive scroll wrapper. |
| `strand-table` | base | Base table element. |
| `strand-table__head` | child | Table header group (thead). |
| `strand-table__body` | child | Table body group (tbody). |
| `strand-table__row` | child | Table row with hover highlight. |
| `strand-table__th` | child | Table header cell (monospaced, uppercase, tracked). |
| `strand-table__td` | child | Table data cell. |
| `strand-table__sort-btn` | child | Sortable column header button. |
| `strand-table__sort-indicator` | child | Sort direction indicator. |

**Usage:**

```html
<div class="strand-table-wrapper">
  <table class="strand-table">
    <thead class="strand-table__head">
      <tr><th class="strand-table__th">Name</th></tr>
    </thead>
    <tbody class="strand-table__body">
      <tr class="strand-table__row"><td class="strand-table__td">Alice</td></tr>
    </tbody>
  </table>
</div>
```

---

### Tabs

Content switching with accessible tab pattern.

| Class | Type | Description |
|---|---|---|
| `strand-tabs` | base | Tab container. |
| `strand-tabs__tab` | child | Individual tab button. |
| `strand-tabs__tab--active` | child | Active tab state. |
| `strand-tabs__panel--reveal` | child | Panel entrance animation. |
| `strand-tabs--instrument` | modifier | Instrument viewport variant for tabs. |

**Usage:**

```html
<div class="strand-tabs">
  <div role="tablist">
    <button role="tab" class="strand-tabs__tab strand-tabs__tab--active" aria-selected="true">Tab 1</button>
  </div>
</div>
```

---

### Tag

Categorization label with optional remove button.

| Class | Type | Description |
|---|---|---|
| `strand-tag` | base | Base tag element. |
| `strand-tag__text` | child | Tag text content. |
| `strand-tag__remove` | child | Remove button. |
| `strand-tag--solid` | modifier | Solid filled variant. |
| `strand-tag--outlined` | modifier | Outlined variant. |
| `strand-tag--default` | modifier | Default color. |
| `strand-tag--teal` | modifier | Teal color. |
| `strand-tag--blue` | modifier | Blue color. |
| `strand-tag--amber` | modifier | Amber color. |
| `strand-tag--red` | modifier | Red color. |
| `strand-chip--joined` | modifier | |
| `strand-chip--joined__check` | child | |

**Usage:**

```html
<span class="strand-tag strand-tag--solid strand-tag--blue">
  <span class="strand-tag__text">Design</span>
</span>
```

---

### Textarea

Multi-line text entry with optional character count.

| Class | Type | Description |
|---|---|---|
| `strand-textarea` | base | Wrapper element for the textarea. |
| `strand-textarea__field` | child | The native textarea element. |
| `strand-textarea__count` | child | Character count display. |
| `strand-textarea--error` | modifier | Error state. |
| `strand-textarea--disabled` | modifier | Disabled state. |
| `strand-textarea--auto-resize` | modifier | Auto-resize modifier. |

**Usage:**

```html
<div class="strand-textarea">
  <textarea class="strand-textarea__field" placeholder="Enter text"></textarea>
</div>
```

---

### Toast

Transient notification with status variants.

| Class | Type | Description |
|---|---|---|
| `strand-toast` | base | Base toast element. |
| `strand-toast__container` | child | Fixed stacking container (bottom-right). |
| `strand-toast__status` | child | Status prefix label. |
| `strand-toast__message` | child | Message text. |
| `strand-toast__dismiss` | child | Dismiss button. |
| `strand-toast--info` | modifier | Info status. |
| `strand-toast--success` | modifier | Success status. |
| `strand-toast--warning` | modifier | Warning status. |
| `strand-toast--error` | modifier | Error status. |

**Usage:**

```html
<div class="strand-toast strand-toast--info" role="status" aria-live="polite">
  <span class="strand-toast__status">INFO</span>
  <span class="strand-toast__message">Changes saved.</span>
  <button class="strand-toast__dismiss" aria-label="Dismiss">&times;</button>
</div>
```

---

### TokenSpecimen

Spacing/radius/shadow token specimen tiles. Each tile pairs a visual (spacer bar, rounded box, or shadow tile) with mono labels. Visual dimensions are set inline per token.

| Class | Type | Description |
|---|---|---|
| `strand-token-specimen-grid` | base | Specimen grid (auto-fill, 132px minimum tiles). |
| `strand-token-specimen` | base | Single token specimen (vertical stack + mono labels). |
| `strand-token-specimen__spacer` | child | Horizontal spacer bar (blue-primary); width set inline. |
| `strand-token-specimen__box` | child | 64x64 box; radius and box-shadow set inline per specimen. |

**Usage:**

```html
<div class="strand-token-specimen-grid">
  <div class="strand-token-specimen">
    <b>space-4</b>
    <span class="strand-token-specimen__spacer" style="width: 16px;"></span>
    <span>16px</span>
  </div>
</div>
```

---

### Tooltip

Contextual hint with position variants.

| Class | Type | Description |
|---|---|---|
| `strand-tooltip__wrapper` | child | Wrapper for the trigger element. |
| `strand-tooltip` | base | Tooltip content element. |
| `strand-tooltip--top` | modifier | Position above trigger. |
| `strand-tooltip--right` | modifier | Position to the right. |
| `strand-tooltip--bottom` | modifier | Position below trigger. |
| `strand-tooltip--left` | modifier | Position to the left. |
| `strand-tooltip--visible` | modifier | Show the tooltip. |

**Usage:**

```html
<span class="strand-tooltip__wrapper" aria-describedby="tip-1">
  Hover me
  <span id="tip-1" class="strand-tooltip strand-tooltip--top" role="tooltip">Helpful tip</span>
</span>
```

---

### TypeSpecimen

Typography specimen. Stacks a display line on top of a mono meta row; siblings are separated by dashed dividers.

| Class | Type | Description |
|---|---|---|
| `strand-type-specimen` | base | Specimen container (vertical stack with dashed top border). |
| `strand-type-specimen__meta` | child | Mono meta row; inline <b> children highlight in blue-primary. |

**Usage:**

```html
<div class="strand-type-specimen">
  <h2 class="strand-headline strand-headline--xl">The quick brown fox</h2>
  <span class="strand-type-specimen__meta">Inter <b>48px</b> <b>weight-300</b> <b>tracking-tight</b></span>
</div>
```

---

### Global (Utilities, Molecules, Typography)

Utilities, molecules, typography, and empty states from static.css.

| Class | Description |
|---|---|
| `strand-static` | Presentation mode: full opacity, no transitions. |
| `strand-viewport` | Recessed viewport for component previews. |
| `strand-viewport--flex` | Flex layout viewport (center-aligned, gap-4, wrap). |
| `strand-viewport--flex-col` | Flex column layout viewport. |
| `strand-viewport--frosted` | Frosted glass viewport variant. |
| `strand-glass-surface` | Frosted-glass treatment for any surface. |
| `strand-overline` | Monospace uppercase tracked label (specimen label pattern). |
| `strand-overline--accent` | Accent (blue) overline variant. |
| `strand-overline--pulse` | Overline with animated pulse dot prefix. |
| `strand-headline` | Display heading (mono uppercase, light weight). |
| `strand-headline--xl` | Hero-size headline (fluid 2.5-5rem). |
| `strand-headline--lg` | Section-size headline (fluid 1.5-2.5rem). |
| `strand-headline--md` | Medium headline size. |
| `strand-headline--mono` | Mono-family headline with sentence case. |
| `strand-headline--gradient` | Gradient text fill for hero headlines. |
| `strand-title` | Human voice display heading (sans-serif, light). |
| `strand-lead` | Intro paragraph (text-lg, gray-500, max 50ch). |
| `strand-text-secondary` | Caption/description text (text-sm, gray-500). |
| `strand-text-secondary--xs` | Extra-small secondary text for metadata. |
| `strand-font-mono` | Monospace font-family utility for inline meta rows and cadence lines. |
| `strand-text-sm` | Font-size utility: small step (text-sm). Pure size lever with no color change, for shrinking a value such as a URL, code, or id to fit a constrained space. Use instead of strand-text-secondary when the text must keep its primary color. |
| `strand-text-xs` | Font-size utility: extra-small step (text-xs). Pure size lever with no color change. |
| `strand-break-anywhere` | Text-flow utility: overflow-wrap: anywhere. Wraps a long unbreakable string (URL, hash, id, token) inside a constrained box instead of overflowing. |
| `strand-nowrap` | Text-flow utility: white-space: nowrap. Keeps a short data atom (date, amount, id) on one line so a squeezed table or flex row wraps its prose neighbors instead. The inverse of strand-break-anywhere. |
| `strand-pt-1` | Padding-top: space-1. |
| `strand-pt-2` | Padding-top: space-2. |
| `strand-pt-3` | Padding-top: space-3. |
| `strand-pt-4` | Padding-top: space-4. |
| `strand-pt-5` | Padding-top: space-5. |
| `strand-pt-6` | Padding-top: space-6. |
| `strand-pt-8` | Padding-top: space-8. |
| `strand-pb-1` | Padding-bottom: space-1. |
| `strand-pb-2` | Padding-bottom: space-2. |
| `strand-pb-3` | Padding-bottom: space-3. |
| `strand-pb-4` | Padding-bottom: space-4. |
| `strand-pb-5` | Padding-bottom: space-5. |
| `strand-pb-6` | Padding-bottom: space-6. |
| `strand-pb-8` | Padding-bottom: space-8. |
| `strand-py-1` | Padding block (top+bottom): space-1. |
| `strand-py-2` | Padding block (top+bottom): space-2. |
| `strand-py-3` | Padding block (top+bottom): space-3. |
| `strand-py-4` | Padding block (top+bottom): space-4. |
| `strand-py-5` | Padding block (top+bottom): space-5. |
| `strand-py-6` | Padding block (top+bottom): space-6. |
| `strand-py-8` | Padding block (top+bottom): space-8. |
| `strand-inline-flex` | Inline flex row for a small content-sized cluster (icon + label, nav slot); centers items with a space-2 gap. Unlike strand-stack it shrink-wraps rather than filling. |
| `strand-italic` | font-style: italic utility for a single emphasized run (e.g. an edited marker). |
| `strand-list-reset` | Strips default list chrome (list-style/margin/padding) so a semantic ul/ol can carry strand-stack layout without browser bullets or indent. |
| `strand-is-disabled` | Non-interactive visual state (opacity + pointer-events:none) for a control whose action is unavailable; pair with aria-disabled/disabled. |
| `strand-link--inherit` | Link modifier: inherit the surrounding text color and drop the underline gradient, for a link that should read as body/heading text (e.g. a whole card title wrapped in an anchor). |
| `strand-embed-16x9` | Responsive 16:9 media box; the child iframe fills it absolutely so no intrinsic-size inline styles are needed for a video or map embed. |
| `strand-page--centered` | Full-viewport single-card layout (min-height:100vh, flex-centered) for token/confirmation pages (rate-via-email, unsubscribe) with no bespoke page CSS. |
| `strand-value` | Value tone base: tabular numerals for aligned figures. Compose with a tone modifier onto any text node holding a money or signed figure (table cell, data-readout value, kv value). |
| `strand-value--positive` | Value tone: money in (credit, surplus, money kept) in green-positive-deep. The tone color wins over the host component's own color wherever it is composed. |
| `strand-value--negative` | Value tone: money out (debit, overage, shortfall) in red-alert-deep. The tone color wins over the host component's own color wherever it is composed. |
| `strand-code-name` | Mono identifier heading (component names, API ids). |
| `strand-heading--sm` | Section heading inside cards (text-lg, medium). |
| `strand-sr-only` | Visually hidden, accessible to screen readers. |
| `strand-skip-link` | Bypass-blocks link: visually hidden until focused, then a visible control at the top of the viewport. Give it an href to your main landmark. |
| `strand-text-center` | Center text alignment. |
| `strand-section-header` | Section heading group with bottom margin. |
| `strand-step-indicator` | Numbered position indicator (32px circle). |
| `strand-steps-connected` | Visual connectors between step cards. |
| `strand-card-section` | Card sub-section with border and space-between. |
| `strand-kv` | Key-value row (label + value, space-between). |
| `strand-kv__label` | Key-value label (mono uppercase). |
| `strand-kv__value` | Key-value data (mono, tabular-nums). |
| `strand-kv__value--status` | Status-colored key-value data. |
| `strand-kv--editorial` | Editorial modifier: card-metadata rendering with sans Blue-midnight values and dashed divider. Default strand-kv stays mono-tabular for instrument readouts. |
| `strand-log` | Diagnostic log entry row. |
| `strand-log__time` | Log timestamp. |
| `strand-log__status` | Log status label. |
| `strand-log__status--complete` | Complete log status (teal). |
| `strand-log__status--process` | In-process log status (blue). |
| `strand-log__status--warning` | Warning log status (amber). |
| `strand-log__status--error` | Error log status (red). |
| `strand-metric-row` | Centered metric group with responsive gap. |
| `strand-bar-chart` | Bar chart container. |
| `strand-bar-chart__col` | Bar chart column. |
| `strand-bar-chart__bar` | Bar chart bar element. |
| `strand-bar-chart__amount` | Bar chart amount label. |
| `strand-bar-chart__label` | Bar chart axis label. |
| `strand-footer` | Page footer with border-top. |
| `strand-footer__nav` | Footer navigation links. |
| `strand-footer__link` | Footer link (mono, xs, tracked). |
| `strand-footer__copy` | Footer copyright text. |
| `strand-form-grid` | Form layout grid with consistent gap. |
| `strand-form-row` | Side-by-side form fields (responsive). |
| `strand-honeypot` | Hidden honeypot field for bot prevention. |
| `strand-hero-bg` | Full-bleed hero background container. |
| `strand-pulse` | Pulsing alive indicator dot. |
| `strand-auth-indicator` | Signed-in text indicator for nav. |
| `strand-auth-avatar` | Small avatar circle for nav. |
| `strand-status-chip` | Inline status classification pill. A flex container, so an icon placed before the label can never break onto its own line and is spaced from it automatically; put the glyph first and the text after, with no wrapper and no utility classes. The label itself still wraps when the chip is narrow. |
| `strand-status-chip--live` | Live status chip (teal tint). |
| `strand-status-chip--neutral` | Neutral status chip (gray tint). |
| `strand-status-chip--accent` | Accent status chip (blue tint). |
| `strand-status-chip--caution` | Caution status chip (amber tint). |
| `strand-status-chip--committed` | Committed status chip (teal-vital, translucent fill + border). Signals a post-RSVP commitment. |
| `strand-idle-readout` | Empty-state data readout showing placeholder. |
| `strand-empty-collection` | Empty list/grid state with centered message. |
| `strand-empty-collection__message` | Empty collection message text. |
| `strand-empty-collection__action` | Empty collection call-to-action link. |
| `strand-empty-search` | Empty search results state. |
| `strand-empty-search__count` | Empty search count (e.g. '0 matches'). |
| `strand-empty-search__suggestion` | Empty search suggestion text. |
| `strand-block` | display: block utility. |
| `strand-flex-1` | flex: 1 utility. |
| `strand-min-w-0` | min-width: 0 utility. |
| `strand-full-width` | width: 100% utility. |
| `strand-mt-1` | Margin-top: space-1. |
| `strand-mt-2` | Margin-top: space-2. |
| `strand-mt-3` | Margin-top: space-3. |
| `strand-mt-4` | Margin-top: space-4. |
| `strand-mt-5` | Margin-top: space-5. |
| `strand-mt-6` | Margin-top: space-6. |
| `strand-mt-8` | Margin-top: space-8. |
| `strand-mb-1` | Margin-bottom: space-1. |
| `strand-mb-2` | Margin-bottom: space-2. |
| `strand-mb-3` | Margin-bottom: space-3. |
| `strand-mb-4` | Margin-bottom: space-4. |
| `strand-mb-5` | Margin-bottom: space-5. |
| `strand-mb-6` | Margin-bottom: space-6. |
| `strand-mb-8` | Margin-bottom: space-8. |
| `strand-mx-auto` | Horizontal auto margins for centering. |
| `strand-m-0` | Margin: 0. Strips a browser default margin (e.g. a paragraph inside a stack that already owns the gap) so the element sits flush without an inline style. |
| `strand-hide-below-sm` | Hidden below 640px. Pairs exactly with strand-hide-from-sm: the two are complements, so a pair covers every viewport once with no overlap and no gap. Hide-only by design; an element is shown by not hiding it, because a matching show utility would have to guess the element's natural display and would flatten a flex or grid container. |
| `strand-hide-from-sm` | Hidden at 640px and above. |
| `strand-hide-below-md` | Hidden below 768px. The desktop half of a two-presentation control: put both in the markup and let CSS choose, rather than measuring the viewport in JavaScript, which renders the control a frame late and shifts whatever region it lands in. |
| `strand-hide-from-md` | Hidden at 768px and above. The mobile half of the same pair. |
| `strand-hide-below-lg` | Hidden below 1024px. |
| `strand-hide-from-lg` | Hidden at 1024px and above. |
| `strand-hide-below-xl` | Hidden below 1280px. |
| `strand-hide-from-xl` | Hidden at 1280px and above. |
| `strand-truncate` | Single-line ellipsis. Pair with strand-min-w-0 on a flex child, or the line never shrinks enough to truncate. |
| `strand-flex-none` | The shrink-proof pair of strand-flex-1, for an item that must keep its content width (a count, a timestamp). Note strand-truncate alone does NOT protect a flex item: its overflow: hidden resets min-width: auto to 0, which is exactly what re-enables shrinking. |
| `strand-nav-offset` | Top padding clearing a fixed glass nav, for the first content section on a page that uses strand-nav--glass. Without it the nav overlaps that section's first line. |
| `strand-hero-grid` | Hero layout grid. |
| `strand-bar-chart--sm` | Compact bar chart, 96px. For dense contexts; the default height is 160px because at 96 the usable bar range collapses to about 10px and a 2.5:1 data ratio becomes a 6px difference. |
| `strand-bar-chart--lg` | Large bar chart, 192px. For primary readouts and large displays. |
| `strand-tabbar-offset` | Reserves the space a fixed bottom tab bar occupies, so the last item of a list is not permanently underneath the navigation. Applied to the SCROLLING CONTENT, not to the bar, which is why it is a utility rather than part of the component. Shares one token with the bar so a taller bar cannot outgrow its reservation. |
| `strand-sticky` | A region that scrolls with the document until it reaches its offset, then holds: a filter rail beside a result list, a day rail beside a schedule, a commitment rail beside a long detail page. Offset is --strand-sticky-top (default space-6), a custom property rather than a set of utilities because the value a consumer needs is whatever their fixed chrome occupies. CAUTION: a sticky element is positioned against its nearest scrollport, and ANY ancestor with overflow: hidden becomes one, so the element sticks to a box that never scrolls and looks exactly like sticky being ignored. strand-grid uses overflow: clip for this reason; clip clips identically and creates no scrollport. |
| `strand-scroll-row` | A single row that scrolls sideways instead of wrapping: a mobile filter strip, a chip rail, any horizontal set that must stay one line at 390px. strand-stack--horizontal plus strand-stack--wrap is the obvious composition and the wrong one, because wrapping is precisely what this must not do. It SCROLLS rather than clipping, which is a deliberate divergence from any mockup specifying overflow: hidden with nowrap: a filter the reader cannot reach is not a filter. Children get flex-shrink: 0 and scroll-snap-align automatically, so they keep their label width and the row scrolls instead of squeezing. Scrollbar hidden; content stays reachable by drag, wheel and keyboard focus. |
| `strand-clip` | Clips children to the container's own rounded corners: the mechanical consequence of sanctioning rounded surfaces, since a square-cornered child flush against a rounded parent overhangs it exactly at the corners. Uses overflow: clip rather than hidden, because hidden also makes the element a SCROLL CONTAINER and would silently break every position:sticky element inside it. A genuinely scrolling region is overflow: auto and a deliberate decision, not this. |
| `strand-log__text` | |
| `strand-hero-grid__line--N` | |
| `strand-hero-grid__nodes` | |
| `strand-hero-grid__lines` | |
| `strand-hero-grid__line` | |
| `strand-hero-grid__line--1` | |
| `strand-hero-grid__line--2` | |
| `strand-hero-grid__line--3` | |
| `strand-hero-grid__line--4` | |
| `strand-hero-grid__line--5` | |
| `strand-hero-grid__line--6` | |
| `strand-hero-grid__line--7` | |
| `strand-hero-grid__line--8` | |
| `strand-hero-grid__line--9` | |
| `strand-hero-grid__line--10` | |
| `strand-hero-grid__line--11` | |
| `strand-hero-grid__line--12` | |
| `strand-hero-grid__line--13` | |
| `strand-hero-grid__line--14` | |
| `strand-hero-grid__line--15` | |
| `strand-hero-grid__line--16` | |
| `strand-hero-grid__line--17` | |
| `strand-hero-grid__line--18` | |
| `strand-command-palette__list` | |
| `strand-detail-panel` | |
| `strand-results-panel__items` | |
| `strand-sheet__body` | |
| `strand-ref-shell__sidebar-scroll` | |
| `strand-scroll-col` | |
| `strand-app-shell` | |
| `strand-ref-shell__sidebar` | |
| `strand-stretch-link-host` | |
| `strand-stretch-link` | |

<!-- GENERATED:COMPONENT-REFERENCE:END -->
