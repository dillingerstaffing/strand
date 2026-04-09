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

```html
<nav class="strand-nav strand-nav--glass">...</nav>
<section class="strand-section strand-section--compact">
  <div class="strand-container strand-container--wide">
    <div class="strand-grid strand-grid--cols-3 strand-grid--gap-6">
      <div class="strand-card">
        <div class="strand-data-readout strand-data-readout--lg">
          <span class="strand-data-readout__label">Metric</span>
          <span class="strand-data-readout__value">94%</span>
        </div>
      </div>
    </div>
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

**Usage:**

```html
<button class="strand-btn strand-btn--primary strand-btn--md" type="button">
  <span class="strand-btn__content">Label</span>
</button>
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
| `strand-badge--default` | modifier | Default color. |
| `strand-badge--teal` | modifier | Teal color. |
| `strand-badge--blue` | modifier | Blue color. |
| `strand-badge--amber` | modifier | Amber color. |
| `strand-badge--red` | modifier | Red color. |

**Usage:**

```html
<span class="strand-badge strand-badge--inline">
  <span class="strand-badge__indicator strand-badge--count strand-badge--blue">5</span>
</span>
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

### DataReadout

Monospace metric display with label and value.

| Class | Type | Description |
|---|---|---|
| `strand-data-readout` | base | Base readout element. |
| `strand-data-readout__label` | child | Monospace uppercase label. |
| `strand-data-readout__value` | child | Large numeric value. |
| `strand-data-readout--sm` | modifier | Small size (text-xl). |
| `strand-data-readout--lg` | modifier | Large size (text-4xl). |
| `strand-data-readout--xl` | modifier | Extra-large size (fluid 72-112px). |

**Usage:**

```html
<div class="strand-data-readout">
  <span class="strand-data-readout__label">Revenue</span>
  <span class="strand-data-readout__value">$142,800</span>
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
| `strand-stack--gap-1` | modifier | Gap: space-1 (4px). |
| `strand-stack--gap-2` | modifier | Gap: space-2 (8px). |
| `strand-stack--gap-3` | modifier | Gap: space-3 (12px). |
| `strand-stack--gap-4` | modifier | Gap: space-4 (16px). |
| `strand-stack--gap-5` | modifier | Gap: space-5 (20px). |
| `strand-stack--gap-6` | modifier | Gap: space-6 (24px). |
| `strand-stack--gap-8` | modifier | Gap: space-8 (32px). |

**Usage:**

```html
<div class="strand-stack strand-stack--vertical strand-stack--gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
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

**Usage:**

```html
<div class="strand-grid strand-grid--cols-3 strand-grid--gap-4">
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</div>
```

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

### Link

Inline navigation link with animated underline.

| Class | Type | Description |
|---|---|---|
| `strand-link` | base | Base link with animated underline on hover. |
| `strand-link--cta` | modifier | Call-to-action link with touch-target height. |
| `strand-link--mono` | modifier | Monospace overline-style link for footers. |

**Usage:**

```html
<a href="/about" class="strand-link">About us</a>
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

### Nav

Site/app navigation with mobile menu and glass variant.

| Class | Type | Description |
|---|---|---|
| `strand-nav` | base | Base nav element. |
| `strand-nav__inner` | child | Inner flex layout container. |
| `strand-nav__logo` | child | Logo/brand area (mono uppercase tracked). |
| `strand-nav__logo--pulse` | child | Animated pulse underline on logo. |
| `strand-nav__items` | child | Navigation links container. |
| `strand-nav__link` | child | Desktop navigation link. |
| `strand-nav__link--active` | child | Active desktop link state. |
| `strand-nav__slot` | child | Right-edge content slot (account, utility). |
| `strand-nav__actions` | child | Actions area. |
| `strand-nav__hamburger` | child | Mobile menu toggle button. |
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

**Usage:**

```html
<div class="strand-alert strand-alert--info" role="status">
  <span class="strand-alert__status">INFO</span>
  <div class="strand-alert__content">This is an informational message.</div>
</div>
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

**Usage:**

```html
<div class="strand-banner strand-banner--info">
  <p class="strand-banner__text">Scheduled maintenance tonight.</p>
  <button class="strand-banner__dismiss" aria-label="Dismiss">...</button>
</div>
```

---

### Dialog

Modal overlay with backdrop, panel, and focus trap.

| Class | Type | Description |
|---|---|---|
| `strand-dialog__backdrop` | child | Full-viewport overlay backdrop. |
| `strand-dialog__panel` | child | Centered dialog panel (max-width 560px). |
| `strand-dialog__header` | child | Dialog header area. |
| `strand-dialog__title` | child | Dialog title text. |
| `strand-dialog__close` | child | Close button. |
| `strand-dialog__body` | child | Dialog content area. |

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

### InstrumentViewport

Dark instrument panel container for data-dense content.

| Class | Type | Description |
|---|---|---|
| `strand-instrument-viewport` | base | Dark viewport surface. |
| `strand-instrument-viewport--grid` | modifier | Grid overlay variant. |
| `strand-instrument-viewport--full-bleed` | modifier | |
| `strand-body--instrument` | modifier | |
| `strand-instrument-viewport__label` | child | |
| `strand-instrument-viewport__value` | child | |
| `strand-instrument-viewport__map` | child | |
| `strand-scanline` | base | |
| `strand-scanline--active` | modifier | |
| `strand-scanline--ambient` | modifier | |
| `strand-viewport-vignette` | base | |
| `strand-coord-readout` | base | |
| `strand-coord-readout__lat` | child | |
| `strand-coord-readout__lng` | child | |
| `strand-map-legend` | base | |
| `strand-map-legend__title` | child | |
| `strand-map-legend__item` | child | |
| `strand-map-legend__dot` | child | |
| `strand-map-legend__dot--tech` | child | |
| `strand-map-legend__dot--health` | child | |
| `strand-map-legend__dot--trades` | child | |
| `strand-map-legend__dot--finance` | child | |
| `strand-search-bar` | base | |
| `strand-search-bar--shifted` | modifier | |
| `strand-search-bar__inner` | child | |
| `strand-search-bar__input` | child | |
| `strand-search-bar__action` | child | |
| `strand-search-bar__action--danger` | child | |
| `strand-search-bar__action--locating` | child | |
| `strand-results-panel` | base | |
| `strand-results-panel__count` | child | |
| `strand-results-panel__items` | child | |
| `strand-results-panel__state` | child | |
| `strand-results-panel__state-title` | child | |
| `strand-results-panel__state-hint` | child | |
| `strand-results-panel__error-link` | child | |
| `strand-result-card` | base | |
| `strand-result-card--active` | modifier | |
| `strand-result-card__title` | child | |
| `strand-result-card__company` | child | |
| `strand-result-card__meta` | child | |
| `strand-result-card__location` | child | |
| `strand-result-card__salary` | child | |
| `strand-result-card__badge` | child | |
| `strand-result-card__badge--remote` | child | |
| `strand-result-card__badge--source` | child | |
| `strand-detail-panel` | base | |
| `strand-detail-panel--open` | modifier | |
| `strand-overline` | base | |
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
| `strand-map-loading` | base | |
| `strand-map-loading--hidden` | modifier | |
| `strand-map-loading__spinner` | child | |
| `strand-map-loading__text` | child | |
| `strand-map-loading__bar` | child | |
| `strand-map-pin` | base | |
| `strand-map-pin--tech` | modifier | |
| `strand-map-pin--health` | modifier | |
| `strand-map-pin--trades` | modifier | |
| `strand-map-pin--finance` | modifier | |
| `strand-map-pin--highlighted` | modifier | |
| `strand-map-pin--dimmed` | modifier | |
| `strand-cluster-marker` | base | |

**Usage:**

```html
<div class="strand-instrument-viewport">
  <!-- Dark data-dense content -->
</div>
```

---

### ScrollReveal

Scroll-triggered entrance animation.

| Class | Type | Description |
|---|---|---|
| `strand-reveal` | base | Element with scroll-triggered fade-up. |
| `strand-reveal--visible` | modifier | Visible state after scroll trigger. |
| `strand-reveal-group` | base | Group container for staggered reveals. |

**Usage:**

```html
<div class="strand-reveal">Fades up on scroll</div>

<div class="strand-reveal-group">
  <div class="strand-reveal">Staggers 0ms</div>
  <div class="strand-reveal">Staggers 80ms</div>
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
| `strand-code-name` | Mono identifier heading (component names, API ids). |
| `strand-heading--sm` | Section heading inside cards (text-lg, medium). |
| `strand-sr-only` | Visually hidden, accessible to screen readers. |
| `strand-text-center` | Center text alignment. |
| `strand-section-header` | Section heading group with bottom margin. |
| `strand-step-indicator` | Numbered position indicator (32px circle). |
| `strand-steps-connected` | Visual connectors between step cards. |
| `strand-card-section` | Card sub-section with border and space-between. |
| `strand-kv` | Key-value row (label + value, space-between). |
| `strand-kv__label` | Key-value label (mono uppercase). |
| `strand-kv__value` | Key-value data (mono, tabular-nums). |
| `strand-kv__value--status` | Status-colored key-value data. |
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
| `strand-status-chip` | Inline status classification pill. |
| `strand-status-chip--live` | Live status chip (teal tint). |
| `strand-status-chip--neutral` | Neutral status chip (gray tint). |
| `strand-status-chip--accent` | Accent status chip (blue tint). |
| `strand-status-chip--caution` | Caution status chip (amber tint). |
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
| `strand-w-full` | width: 100% utility (alias). |
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
| `strand-hero-grid__line--N` | |
| `strand-hero-grid` | |
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

<!-- GENERATED:COMPONENT-REFERENCE:END -->
