# Strand HTML Reference

CSS class API for using Strand UI components as raw HTML. Use this when building without the Preact/React library, for static sites, documentation pages, or server-rendered HTML.

## Required CSS

```html
<link rel="stylesheet" href="path/to/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="path/to/@dillingerstaffing/strand-ui/dist/css/strand-ui.css">
```

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

Use `.strand-viewport` for component previews and showcase containers. It creates a recessed instrument panel effect (sits below the card surface):

```html
<div class="strand-viewport strand-static">
  <!-- component previews here -->
</div>
```

Provides: `--strand-surface-recessed` background, inset shadow, `--strand-radius-lg` corners, `--strand-space-6` padding.

## Padding Tiers

Card padding tiers (used via `strand-card--pad-{sm|md|lg}`):
- `sm`: 16px (compact widgets, dense UIs)
- `md`: 24px (standard cards, default for most contexts)
- `lg`: 40px (showcase, hero, documentation)

## Focus States

All interactive elements include `:focus-visible` styling per Part XII of the design language:

```css
:focus-visible {
  outline: 2px solid var(--strand-blue-primary);
  outline-offset: 2px;
}
```

- Appears on keyboard navigation only (not on mouse click)
- 2px solid blue outline with 2px offset from the element edge
- Applied to: buttons, links, interactive cards, tab buttons, sort buttons, nav links, hamburger menu

No additional classes needed. Focus rings are built into each component's CSS.

## Boundary Integrity

All container components (Grid, Stack, Card, Container) enforce boundary integrity. Children cannot visually breach the parent's padding zone. This is enforced at the CSS level via `overflow: hidden`, `max-width: 100%`, and `min-width: 0` on children. You do not need to add these yourself.

---

## Input Components

### Button

```html
<button class="strand-btn strand-btn--primary strand-btn--md" type="button">
  <span class="strand-btn__content">Label</span>
</button>
```

**Variants:** `strand-btn--primary` | `strand-btn--secondary` | `strand-btn--ghost` | `strand-btn--danger`
**Sizes:** `strand-btn--sm` (32px) | `strand-btn--md` (40px) | `strand-btn--lg` (48px)
**Modifiers:** `strand-btn--full-width` | `strand-btn--icon-only`
**Loading:** Add class `strand-btn--loading` + `<span class="strand-btn__spinner" aria-hidden="true"></span>` before content. Set content span `style="visibility:hidden"`.
**Disabled:** Add `disabled` attribute. Use `.strand-static` parent to show full opacity.

---

### Input

```html
<div class="strand-input">
  <input type="text" class="strand-input__field" placeholder="Enter text">
</div>
```

**States:** `strand-input--error` | `strand-input--disabled`
**Addons:** Add `strand-input--has-leading` to wrapper + `<span class="strand-input__leading" aria-hidden="true">$</span>` before the input. Add `strand-input--has-trailing` to wrapper + `<span class="strand-input__trailing" aria-hidden="true">kg</span>` after the input.
**Error:** Add `strand-input--error` to wrapper and `aria-invalid="true"` to the input element.
**Disabled:** Add `strand-input--disabled` to wrapper and `disabled` to the input element.

---

### Textarea

```html
<div class="strand-textarea">
  <textarea class="strand-textarea__field" placeholder="Enter text"></textarea>
</div>
```

**States:** `strand-textarea--error` | `strand-textarea--disabled` | `strand-textarea--auto-resize`
**Character count:** Add `<span class="strand-textarea__count" aria-live="polite">0/500</span>` after the textarea. Set `maxlength` on the textarea.
**Error:** Add `strand-textarea--error` to wrapper and `aria-invalid="true"` to the textarea.
**Disabled:** Add `strand-textarea--disabled` to wrapper and `disabled` to the textarea.

---

### Select

```html
<div class="strand-select">
  <select class="strand-select__field">
    <option value="" disabled>Choose one</option>
    <option value="a">Option A</option>
    <option value="b">Option B</option>
  </select>
  <span class="strand-select__arrow" aria-hidden="true"></span>
</div>
```

**States:** `strand-select--error` | `strand-select--disabled`
**Error:** Add `strand-select--error` to wrapper and `aria-invalid="true"` to the select.
**Disabled:** Add `strand-select--disabled` to wrapper and `disabled` to the select.
**Note:** The `strand-select__arrow` span renders the dropdown caret via CSS borders. Always include it.

---

### Checkbox

```html
<label class="strand-checkbox strand-checkbox--checked">
  <input type="checkbox" class="strand-checkbox__native" checked role="checkbox" aria-checked="true">
  <span class="strand-checkbox__control" aria-hidden="true">
    <svg class="strand-checkbox__icon" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
  <span class="strand-checkbox__label">Accept terms</span>
</label>
```

**States:** `strand-checkbox--checked` | `strand-checkbox--indeterminate` | `strand-checkbox--disabled`
**Unchecked:** Omit `strand-checkbox--checked` and the SVG inside `strand-checkbox__control`. Set `aria-checked="false"`.
**Indeterminate:** Use `strand-checkbox--indeterminate` + `aria-checked="mixed"` + indeterminate SVG: `<svg class="strand-checkbox__icon" viewBox="0 0 16 16" fill="none"><line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
**Note:** The native input is visually hidden via CSS. The `strand-checkbox__control` span provides the custom visual. SVG is required for the check/dash icon.

---

### Radio

```html
<label class="strand-radio strand-radio--checked">
  <input type="radio" class="strand-radio__native" name="group" value="a" checked>
  <span class="strand-radio__control" aria-hidden="true">
    <span class="strand-radio__dot"></span>
  </span>
  <span class="strand-radio__label">Option A</span>
</label>
```

**States:** `strand-radio--checked` | `strand-radio--disabled`
**Unchecked:** Omit `strand-radio--checked`. The dot is hidden via `transform: scale(0)` in CSS.
**Note:** The native input is visually hidden. The dot scales up when `strand-radio--checked` is present. Group radios with the same `name` attribute.

---

### Switch

```html
<label class="strand-switch strand-switch--checked">
  <button type="button" role="switch" class="strand-switch__track" aria-checked="true">
    <span class="strand-switch__thumb" aria-hidden="true"></span>
  </button>
  <span class="strand-switch__label">Dark mode</span>
</label>
```

**States:** `strand-switch--checked` | `strand-switch--disabled`
**Off:** Omit `strand-switch--checked`. Set `aria-checked="false"`.
**Disabled:** Add `strand-switch--disabled` to the label and `disabled` to the button.
**Note:** The track is a `<button>` with `role="switch"`. The thumb translates right when checked via CSS.

---

### Slider

```html
<div class="strand-slider">
  <input type="range" class="strand-slider__field" min="0" max="100" step="1" value="50"
    aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
</div>
```

**States:** `strand-slider--disabled`
**Disabled:** Add `strand-slider--disabled` to wrapper and `disabled` to the input.
**Note:** Thumb styling uses both `-webkit-slider-thumb` and `-moz-range-thumb` pseudo-elements in the CSS.

---

### FormField

```html
<div class="strand-form-field">
  <label class="strand-form-field__label" for="email">
    Email
    <span class="strand-form-field__required" aria-hidden="true">*</span>
  </label>
  <div class="strand-form-field__control">
    <!-- Place any input component here -->
    <div class="strand-input">
      <input type="email" id="email" class="strand-input__field" placeholder="you@example.com">
    </div>
  </div>
  <p class="strand-form-field__hint" id="email-hint">We will never share your email.</p>
</div>
```

**States:** `strand-form-field--error`
**Error:** Replace `strand-form-field__hint` with `<p class="strand-form-field__error" id="email-error" role="alert">Invalid email address.</p>` and add `strand-form-field--error` to the wrapper.
**Required indicator:** Include `<span class="strand-form-field__required" aria-hidden="true">*</span>` inside the label.
**Note:** The `for` attribute on the label must match the `id` on the input control.

---

## Display Components

### Card

```html
<div class="strand-card strand-card--elevated strand-card--pad-md">
  Card content here.
</div>
```

**Variants:** `strand-card--elevated` | `strand-card--outlined` | `strand-card--interactive`
**Padding:** `strand-card--pad-none` | `strand-card--pad-sm` | `strand-card--pad-md` | `strand-card--pad-lg`
**Note:** `strand-card--interactive` adds hover lift and cursor pointer. Use for clickable cards.

---

### Badge

**Inline (standalone):**

```html
<span class="strand-badge strand-badge--inline">
  <span class="strand-badge__indicator strand-badge--count strand-badge--blue" role="status" aria-label="5 notifications">5</span>
</span>
```

**Wrapping a child (positioned at top-right):**

```html
<span class="strand-badge">
  <!-- Wrapped element (e.g., icon, avatar) -->
  <span style="width:24px;height:24px;display:inline-block;background:#ccc;border-radius:4px;"></span>
  <span class="strand-badge__indicator strand-badge--dot strand-badge--red" role="status" aria-label="Status indicator"></span>
</span>
```

**Display modes:** `strand-badge--dot` (8px circle, no text) | `strand-badge--count` (pill with number)
**Colors:** `strand-badge--default` | `strand-badge--teal` | `strand-badge--blue` | `strand-badge--amber` | `strand-badge--red`
**Note:** When wrapping children, omit `strand-badge--inline`. The indicator auto-positions to top-right via `position: absolute`.

---

### Avatar

**With image:**

```html
<div class="strand-avatar strand-avatar--md" role="img" aria-label="Jane Smith">
  <img class="strand-avatar__img" src="photo.jpg" alt="Jane Smith">
</div>
```

**With initials (fallback):**

```html
<div class="strand-avatar strand-avatar--md" role="img" aria-label="JS">
  <span class="strand-avatar__initials" aria-hidden="true">JS</span>
</div>
```

**Sizes:** `strand-avatar--sm` (32px) | `strand-avatar--md` (40px) | `strand-avatar--lg` (48px) | `strand-avatar--xl` (64px)
**Note:** Initials are auto-uppercased via CSS. Use 1 or 2 characters.

---

### Tag

```html
<span class="strand-tag strand-tag--solid strand-tag--blue">
  <span class="strand-tag__text">Design</span>
</span>
```

**Variants:** `strand-tag--solid` | `strand-tag--outlined`
**Colors:** `strand-tag--default` | `strand-tag--teal` | `strand-tag--blue` | `strand-tag--amber` | `strand-tag--red`
**Removable:** Add a remove button after the text span:

```html
<span class="strand-tag strand-tag--solid strand-tag--blue">
  <span class="strand-tag__text">Design</span>
  <button type="button" class="strand-tag__remove" aria-label="Remove">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</span>
```

**Note:** Color classes combine with variant classes (e.g., `strand-tag--solid strand-tag--blue`). The remove icon SVG is required.

---

### Table

```html
<div class="strand-table-wrapper">
  <table class="strand-table">
    <thead class="strand-table__head">
      <tr>
        <th class="strand-table__th">Name</th>
        <th class="strand-table__th">Role</th>
        <th class="strand-table__th">Status</th>
      </tr>
    </thead>
    <tbody class="strand-table__body">
      <tr class="strand-table__row">
        <td class="strand-table__td">Alice</td>
        <td class="strand-table__td">Engineer</td>
        <td class="strand-table__td">Active</td>
      </tr>
      <tr class="strand-table__row">
        <td class="strand-table__td">Bob</td>
        <td class="strand-table__td">Designer</td>
        <td class="strand-table__td">Away</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Sortable column header:**

```html
<th class="strand-table__th">
  <button type="button" class="strand-table__sort-btn" aria-label="Sort by Name">
    Name <span class="strand-table__sort-indicator" aria-hidden="true">&#8597;</span>
  </button>
</th>
```

**Sort indicators:** `&#8593;` (ascending) | `&#8595;` (descending) | `&#8597;` (unsorted)
**Note:** `strand-table-wrapper` provides horizontal scroll on overflow. Rows highlight on hover.

---

### DataReadout

```html
<div class="strand-data-readout">
  <span class="strand-data-readout__label">Revenue</span>
  <span class="strand-data-readout__value">$142,800</span>
</div>
```

**Note:** Label uses mono font with uppercase tracking. Value uses mono font with tabular numerals at 3xl size. No variants or modifiers.

---

## Layout Components

### Stack

```html
<div class="strand-stack strand-stack--vertical" style="gap: var(--strand-space-4);">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

**Direction:** `strand-stack--vertical` | `strand-stack--horizontal`
**Gap (utility classes):** `strand-stack--gap-1` | `strand-stack--gap-2` | `strand-stack--gap-3` | `strand-stack--gap-4` | `strand-stack--gap-5` | `strand-stack--gap-6` | `strand-stack--gap-8`
**Alignment:** `strand-stack--align-start` | `strand-stack--align-center` | `strand-stack--align-end` (default is stretch)
**Justification:** `strand-stack--justify-start` | `strand-stack--justify-center` | `strand-stack--justify-end` | `strand-stack--justify-between` | `strand-stack--justify-around`
**Wrap:** `strand-stack--wrap`
**Note:** Use either the gap utility class (`strand-stack--gap-4`) or inline `style="gap: var(--strand-space-4)"`. The React component uses inline style; utility classes are available for pure HTML.

---

### Grid

```html
<div class="strand-grid strand-grid--cols-3 strand-grid--gap-4">
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</div>
```

**Columns (utility classes):** `strand-grid--cols-2` | `strand-grid--cols-3` | `strand-grid--cols-4`
**Gap (utility classes):** `strand-grid--gap-1` | `strand-grid--gap-2` | `strand-grid--gap-3` | `strand-grid--gap-4` | `strand-grid--gap-5` | `strand-grid--gap-6` | `strand-grid--gap-8`
**Note:** For column counts beyond 4, use inline style: `style="grid-template-columns: repeat(6, 1fr); gap: var(--strand-space-4);"`. The React component always uses inline style.

---

### Container

```html
<div class="strand-container strand-container--default">
  Centered content with max-width constraint.
</div>
```

**Sizes:** `strand-container--narrow` | `strand-container--default` | `strand-container--wide` | `strand-container--full`
**Note:** Centers content with `margin-inline: auto` and responsive horizontal padding via `clamp(1.5rem, 5vw, 4rem)`.

---

### Divider

**Horizontal (default):**

```html
<hr class="strand-divider strand-divider--horizontal" role="separator" aria-orientation="horizontal">
```

**Horizontal with label:**

```html
<div class="strand-divider strand-divider--horizontal strand-divider--labeled" role="separator" aria-orientation="horizontal">
  <span class="strand-divider__line"></span>
  <span class="strand-divider__label">Or</span>
  <span class="strand-divider__line"></span>
</div>
```

**Vertical:**

```html
<div class="strand-divider strand-divider--vertical" role="separator" aria-orientation="vertical"></div>
```

**Note:** Plain horizontal uses `<hr>`. Labeled horizontal uses `<div>` with two `__line` spans flanking the label. Vertical dividers use `align-self: stretch` to fill the parent height.

---

### Section

```html
<section class="strand-section strand-section--standard strand-section--bg-primary">
  <div class="strand-container strand-container--default">
    Section content here.
  </div>
</section>
```

**Variants:** `strand-section--standard` | `strand-section--hero`
**Backgrounds:** `strand-section--bg-primary` | `strand-section--bg-elevated` | `strand-section--bg-recessed`
**Note:** `standard` uses responsive vertical padding `clamp(4rem, 8vw, 8rem)`. `hero` uses `clamp(6rem, 12vw, 12rem)`. Pair with `strand-container` inside for horizontal constraints.

---

## Navigation Components

### Link

```html
<a href="/about" class="strand-link">About us</a>
```

**External:** Add `target="_blank"` and `rel="noopener noreferrer"`.
**Note:** The underline animates on hover from 0% to 100% width via `background-size`. No variant or modifier classes.

---

### Tabs

```html
<div class="strand-tabs">
  <div role="tablist">
    <button id="tab-overview" role="tab" type="button" class="strand-tabs__tab strand-tabs__tab--active"
      aria-selected="true" aria-controls="panel-overview" tabindex="0">Overview</button>
    <button id="tab-specs" role="tab" type="button" class="strand-tabs__tab"
      aria-selected="false" aria-controls="panel-specs" tabindex="-1">Specs</button>
    <button id="tab-reviews" role="tab" type="button" class="strand-tabs__tab"
      aria-selected="false" aria-controls="panel-reviews" tabindex="-1">Reviews</button>
  </div>

  <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0">
    Overview content here.
  </div>
  <div id="panel-specs" role="tabpanel" aria-labelledby="tab-specs" tabindex="0" hidden>
    Specs content here.
  </div>
  <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" tabindex="0" hidden>
    Reviews content here.
  </div>
</div>
```

**Active tab:** Add `strand-tabs__tab--active` + `aria-selected="true"` + `tabindex="0"`.
**Inactive tabs:** Set `aria-selected="false"` + `tabindex="-1"`. Add `hidden` to their panels.
**Note:** The tablist has a bottom border. Active tab shows a blue bottom border. Wire `aria-controls` / `aria-labelledby` IDs correctly. Arrow key navigation requires JavaScript.

---

### Breadcrumb

```html
<nav aria-label="Breadcrumb" class="strand-breadcrumb">
  <ol class="strand-breadcrumb__list">
    <li class="strand-breadcrumb__item">
      <a href="/" class="strand-breadcrumb__link">Home</a>
    </li>
    <li class="strand-breadcrumb__item">
      <span class="strand-breadcrumb__separator" aria-hidden="true">/</span>
      <a href="/products" class="strand-breadcrumb__link">Products</a>
    </li>
    <li class="strand-breadcrumb__item">
      <span class="strand-breadcrumb__separator" aria-hidden="true">/</span>
      <span class="strand-breadcrumb__current" aria-current="page">Widget</span>
    </li>
  </ol>
</nav>
```

**Note:** The last item uses `strand-breadcrumb__current` with `aria-current="page"` instead of a link. Separators use `aria-hidden="true"`. The first item has no separator.

---

### Nav

```html
<nav class="strand-nav" aria-label="Main navigation">
  <div class="strand-nav__inner">
    <div class="strand-nav__logo">
      <!-- Logo element (image, SVG, or text) -->
      <strong>Brand</strong>
    </div>
    <div class="strand-nav__items">
      <a href="/" class="strand-nav__link strand-nav__link--active" aria-current="page">Home</a>
      <a href="/about" class="strand-nav__link">About</a>
      <a href="/contact" class="strand-nav__link">Contact</a>
    </div>
    <div class="strand-nav__actions">
      <!-- Action buttons or elements -->
      <button class="strand-btn strand-btn--primary strand-btn--sm" type="button">
        <span class="strand-btn__content">Sign in</span>
      </button>
    </div>
    <button type="button" class="strand-nav__hamburger" aria-expanded="false" aria-label="Menu">
      <span class="strand-nav__hamburger-icon" aria-hidden="true"></span>
    </button>
  </div>
  <!-- Mobile menu (hidden by default, shown via JS toggling display) -->
  <div class="strand-nav__mobile-menu" style="display:none;">
    <a href="/" class="strand-nav__mobile-link strand-nav__mobile-link--active" aria-current="page">Home</a>
    <a href="/about" class="strand-nav__mobile-link">About</a>
    <a href="/contact" class="strand-nav__mobile-link">Contact</a>
  </div>
</nav>
```

**Active link:** `strand-nav__link--active` (desktop) | `strand-nav__mobile-link--active` (mobile)
**Note:** The nav bar is 64px tall. Desktop items and actions hide below 768px; the hamburger and mobile menu show instead. The hamburger icon is a CSS-only three-line icon (middle line + `::before`/`::after` pseudo-elements). Toggle mobile menu visibility with JavaScript.

---

## Feedback Components

### Toast

```html
<div class="strand-toast strand-toast--info" role="status" aria-live="polite">
  <span class="strand-toast__message">Changes saved successfully.</span>
  <button type="button" class="strand-toast__dismiss" aria-label="Dismiss">&times;</button>
</div>
```

**Statuses:** `strand-toast--info` | `strand-toast--success` | `strand-toast--warning` | `strand-toast--error`
**Toast container (for stacking multiple toasts):**

```html
<div class="strand-toast__container">
  <!-- Toasts stack here, newest at bottom -->
</div>
```

**Note:** Container is fixed to bottom-right (`position: fixed`). Use `aria-live="assertive"` for `warning` and `error` statuses. Each status sets a colored left border accent. Dismiss button renders `&times;`.

---

### Alert

```html
<div class="strand-alert strand-alert--info" role="status">
  <div class="strand-alert__content">This is an informational message.</div>
</div>
```

**Statuses:** `strand-alert--info` | `strand-alert--success` | `strand-alert--warning` | `strand-alert--error`
**Dismissible:** Add a dismiss button after content:

```html
<div class="strand-alert strand-alert--warning" role="alert">
  <div class="strand-alert__content">Disk space running low.</div>
  <button type="button" class="strand-alert__dismiss" aria-label="Dismiss">&times;</button>
</div>
```

**Note:** Use `role="alert"` for `warning` and `error`, `role="status"` for `info` and `success`. Each status has a colored left border and tinted background.

---

### Dialog

```html
<div class="strand-dialog__backdrop">
  <div class="strand-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabindex="-1">
    <div class="strand-dialog__header">
      <h2 id="dialog-title" class="strand-dialog__title">Confirm action</h2>
    </div>
    <button type="button" class="strand-dialog__close" aria-label="Close">&times;</button>
    <div class="strand-dialog__body">
      Are you sure you want to proceed?
    </div>
  </div>
</div>
```

**Note:** The backdrop covers the viewport with a semi-transparent overlay (`position: fixed; inset: 0`). The panel is centered, max-width 560px, with elevation shadow. Focus trap and scroll lock require JavaScript. Omit the `strand-dialog__header` div if no title is needed.

---

### Tooltip

```html
<span class="strand-tooltip__wrapper" aria-describedby="tip-1">
  Hover me
  <span id="tip-1" class="strand-tooltip strand-tooltip--top strand-tooltip--visible" role="tooltip">
    Helpful tip
  </span>
</span>
```

**Positions:** `strand-tooltip--top` | `strand-tooltip--right` | `strand-tooltip--bottom` | `strand-tooltip--left`
**Visibility:** Add `strand-tooltip--visible` to show. Without it, tooltip has `opacity: 0`.
**Note:** The wrapper needs `position: relative` (provided by `strand-tooltip__wrapper`). For static display, add `strand-tooltip--visible` directly. For interactive use, toggle that class via JavaScript on hover/focus. Wire `aria-describedby` on the wrapper to the tooltip `id`.

---

### Progress

**Determinate bar:**

```html
<div class="strand-progress strand-progress--bar strand-progress--md" role="progressbar"
  aria-valuemin="0" aria-valuemax="100" aria-valuenow="65">
  <div class="strand-progress__fill" style="width: 65%;"></div>
</div>
```

**Indeterminate bar:**

```html
<div class="strand-progress strand-progress--bar strand-progress--md strand-progress--indeterminate"
  role="progressbar" aria-valuemin="0" aria-valuemax="100">
  <div class="strand-progress__fill"></div>
</div>
```

**Determinate ring:**

```html
<div class="strand-progress strand-progress--ring strand-progress--md" role="progressbar"
  aria-valuemin="0" aria-valuemax="100" aria-valuenow="65">
  <svg width="40" height="40" viewBox="0 0 40 40" class="strand-progress__ring">
    <circle cx="20" cy="20" r="18.5" fill="none" stroke-width="3" class="strand-progress__track"/>
    <circle cx="20" cy="20" r="18.5" fill="none" stroke-width="3"
      stroke-dasharray="116.24" stroke-dashoffset="40.68"
      stroke-linecap="round" class="strand-progress__fill"
      transform="rotate(-90 20 20)"/>
  </svg>
</div>
```

**Sizes (bar):** `strand-progress--sm` (4px) | `strand-progress--md` (8px) | `strand-progress--lg` (12px)
**Sizes (ring):** `strand-progress--sm` (24px) | `strand-progress--md` (40px) | `strand-progress--lg` (56px)
**Note:** For indeterminate bars, omit `aria-valuenow`; the fill animates via CSS. For rings, compute `stroke-dasharray` as `2 * PI * radius` and `stroke-dashoffset` as `dasharray * (1 - value/100)`. Ring dimensions by size: sm=24 (r=10.5), md=40 (r=18.5), lg=56 (r=26.5). Stroke width is always 3.

---

### Spinner

```html
<span class="strand-spinner strand-spinner--md" role="status">
  <span class="strand-spinner__ring" aria-hidden="true"></span>
  <span class="strand-spinner__sr-only">Loading</span>
</span>
```

**Sizes:** `strand-spinner--sm` (16px) | `strand-spinner--md` (20px) | `strand-spinner--lg` (32px)
**Note:** The ring animates a spinning border. `strand-spinner__sr-only` provides accessible text (visually hidden, read by screen readers). Always include it.

---

### Skeleton

```html
<div class="strand-skeleton strand-skeleton--text strand-skeleton--shimmer" aria-hidden="true"
  style="width: 100%; height: 1em;"></div>
```

**Variants:** `strand-skeleton--text` (4px border-radius, 1em default height) | `strand-skeleton--rectangle` (md border-radius) | `strand-skeleton--circle` (full border-radius)
**Shimmer:** Always add `strand-skeleton--shimmer` for the animated gradient effect.
**Sizing:** Set `width` and `height` via inline `style`. For circles, set equal width and height.

```html
<!-- Rectangle -->
<div class="strand-skeleton strand-skeleton--rectangle strand-skeleton--shimmer" aria-hidden="true"
  style="width: 200px; height: 120px;"></div>

<!-- Circle -->
<div class="strand-skeleton strand-skeleton--circle strand-skeleton--shimmer" aria-hidden="true"
  style="width: 48px; height: 48px;"></div>
```

**Note:** Always include `aria-hidden="true"`. Skeletons are placeholder visuals, not interactive.
