# Using Strand with Bootstrap

Strand and Bootstrap coexist without conflicts. All Strand classes are prefixed with `strand-`, so there are zero collisions with Bootstrap's `btn-`, `col-`, `card`, etc. Add Strand components to your existing Bootstrap project alongside your current layout and utilities. Or migrate incrementally at your own pace.

## Class Mapping

| Bootstrap 5 | Strand | Notes |
|-------------|--------|-------|
| `btn btn-primary` | `strand-btn strand-btn--primary strand-btn--md` | Strand uses BEM with explicit size modifier (`--sm`, `--md`, `--lg`) |
| `btn btn-secondary` | `strand-btn strand-btn--secondary strand-btn--md` | |
| `btn btn-danger` | `strand-btn strand-btn--danger strand-btn--md` | |
| `btn btn-outline-primary` | `strand-btn strand-btn--secondary strand-btn--md` | Strand secondary is the outlined variant |
| `btn btn-link` | `strand-btn strand-btn--ghost strand-btn--md` | |
| `btn btn-sm` | `strand-btn strand-btn--primary strand-btn--sm` | Size is a separate modifier, not a size class |
| `btn btn-lg` | `strand-btn strand-btn--primary strand-btn--lg` | |
| `card` | `strand-card strand-card--elevated strand-card--pad-md` | Strand requires variant (`--elevated`, `--outlined`, `--interactive`) and padding (`--pad-none`, `--pad-sm`, `--pad-md`, `--pad-lg`) |
| `card-body` | (use padding modifier on card) | Strand manages card padding at the card level |
| `card-title` / `card-text` | (use semantic HTML) | No special card content classes |
| `form-control` | `strand-input` wrapper + `strand-input__field` | Strand wraps `<input>` in a `<div class="strand-input">` |
| `form-control` (textarea) | `strand-textarea` wrapper + `strand-textarea__field` | Same wrapper pattern |
| `form-select` | `strand-select` wrapper + `strand-select__field` + `strand-select__arrow` | Strand wraps `<select>` with a custom arrow |
| `form-label` | `strand-form-field__label` | Inside a `strand-form-field` wrapper |
| `form-text` | `strand-form-field__hint` | |
| `invalid-feedback` | `strand-form-field__error` | |
| `form-check` + `form-check-input` (checkbox) | `strand-checkbox` + `strand-checkbox__native` + `strand-checkbox__control` | Custom control with SVG check icon |
| `form-check` + `form-check-input` (radio) | `strand-radio` + `strand-radio__native` + `strand-radio__control` | Custom control with dot indicator |
| `form-check-label` | `strand-checkbox__label` / `strand-radio__label` | |
| `alert alert-success` | `strand-alert strand-alert--success` | Variants: `--info`, `--success`, `--warning`, `--error` |
| `alert alert-danger` | `strand-alert strand-alert--error` | Bootstrap `danger` maps to Strand `error` |
| `alert alert-warning` | `strand-alert strand-alert--warning` | |
| `alert alert-info` | `strand-alert strand-alert--info` | |
| `btn-close` (in alert) | `strand-alert__dismiss` | |
| `navbar` | `strand-nav` | Sub-elements: `strand-nav__inner`, `strand-nav__logo`, `strand-nav__items`, `strand-nav__actions` |
| `navbar-brand` | `strand-nav__logo` | |
| `nav-link` | `strand-nav__link` | Active state: `strand-nav__link--active` |
| `navbar-toggler` | `strand-nav__hamburger` | Auto-shown below 768px |
| `navbar-collapse` | `strand-nav__mobile-menu` | Mobile links use `strand-nav__mobile-link` |
| `nav-tabs` / `nav-link` | `strand-tabs` + `strand-tabs__tab` | Active: `strand-tabs__tab--active`. Uses `role="tablist"` / `role="tabpanel"` for accessibility |
| `badge bg-primary` | `strand-tag strand-tag--solid strand-tag--blue` | Colors: `--default`, `--teal`, `--blue`, `--amber`, `--red`. Variants: `--solid`, `--outlined` |
| `badge bg-success` | `strand-tag strand-tag--solid strand-tag--teal` | |
| `badge bg-warning` | `strand-tag strand-tag--solid strand-tag--amber` | |
| `badge bg-danger` | `strand-tag strand-tag--solid strand-tag--red` | |
| `table` | `strand-table-wrapper` + `strand-table` | Wrapper provides responsive horizontal scroll |
| `table` `<th>` | `strand-table__th` | Monospaced, uppercase, tracked headers |
| `table` `<td>` | `strand-table__td` | |
| `table` `<tr>` | `strand-table__row` | Includes hover highlight |
| `table-responsive` | `strand-table-wrapper` | The wrapper is the responsive container |
| `row` | `strand-grid strand-grid--cols-N` | N = 2, 3, or 4. Add gap: `strand-grid--gap-4` (gap-1 through gap-8) |
| `col` | (direct children of grid) | No class needed on children |
| `col-6` | `strand-grid--cols-2` on parent | Strand uses column-count on parent, not per-child width |
| `col-4` | `strand-grid--cols-3` on parent | |
| `col-3` | `strand-grid--cols-4` on parent | |
| `container` | `strand-container strand-container--default` | Four width tiers: `--narrow` (640px), `--default` (768px), `--wide` (1024px), `--full` (1280px) |
| `container-fluid` | `strand-container strand-container--full` | |
| `section` (custom) | `strand-section strand-section--standard` | Variants: `--standard`, `--hero`. Backgrounds: `--bg-primary`, `--bg-elevated`, `--bg-recessed` |
| `modal` | `strand-dialog__backdrop` + `strand-dialog__panel` | No JavaScript required for overlay styling |
| `modal-dialog` | `strand-dialog__panel` | |
| `modal-header` | `strand-dialog__header` | |
| `modal-title` | `strand-dialog__title` | |
| `modal-body` | `strand-dialog__body` | |
| `btn-close` (in modal) | `strand-dialog__close` | |
| `progress` | `strand-progress strand-progress--bar` | Sizes: `--sm` (4px), `--md` (8px), `--lg` (12px) |
| `progress-bar` | `strand-progress__fill` | Set width via inline style. Indeterminate: add `strand-progress--indeterminate` |

## Variable Mapping

Bootstrap 5 uses both Sass variables and CSS custom properties. Strand uses CSS custom properties exclusively.

<!-- GENERATED:BOOTSTRAP-VARS:START -->
| Bootstrap 5 | Strand |
|---|---|
| `--bs-primary / $primary` | `--strand-blue-primary` |
| `--bs-secondary / $secondary` | `--strand-gray-500` |
| `--bs-success / $success` | `--strand-teal-vital` |
| `--bs-info / $info` | `--strand-blue-indicator` |
| `--bs-warning / $warning` | `--strand-amber-caution` |
| `--bs-danger / $danger` | `--strand-red-alert` |
| `--bs-light / $light` | `--strand-surface-recessed` |
| `--bs-dark / $dark` | `--strand-blue-midnight` |
| `--bs-body-color` | `--strand-gray-600` |
| `--bs-body-bg` | `--strand-surface-primary` |
| `--bs-body-font-family` | `--strand-font-sans` |
| `--bs-font-monospace` | `--strand-font-mono` |
| `--bs-border-radius` | `--strand-radius-md` |
| `--bs-border-radius-sm` | `--strand-radius-sm` |
| `--bs-border-radius-lg` | `--strand-radius-lg` |
| `--bs-border-color` | `--strand-gray-200` |
| `$spacer` | `--strand-space-4` |
| `$font-size-sm` | `--strand-text-sm` |
| `$font-size-base` | `--strand-text-base` |
| `$font-size-lg` | `--strand-text-lg` |
<!-- GENERATED:BOOTSTRAP-VARS:END -->

## Grid Migration

Bootstrap uses a 12-column grid with per-child column classes. Strand uses CSS Grid with column-count on the parent.

```html
<!-- Bootstrap -->
<div class="row g-4">
  <div class="col-md-4">A</div>
  <div class="col-md-4">B</div>
  <div class="col-md-4">C</div>
</div>

<!-- Strand -->
<div class="strand-grid strand-grid--cols-3 strand-grid--gap-4">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>
```

For layouts that need unequal columns, use CSS Grid directly with Strand spacing tokens:

```css
.custom-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--strand-space-4);
}
```

## Utility Classes

Bootstrap ships hundreds of utility classes (`mt-3`, `d-flex`, `text-center`, `bg-primary`). Strand does not include utility classes. Instead, use CSS custom properties directly:

```css
/* Bootstrap utility approach */
<div class="mt-3 p-4 bg-light rounded">

/* Strand approach: use tokens in your own CSS */
.my-component {
  margin-top: var(--strand-space-3);
  padding: var(--strand-space-4);
  background: var(--strand-surface-recessed);
  border-radius: var(--strand-radius-md);
}
```

This produces less HTML class bloat and gives you full control over responsive behavior.

## Migration Procedure

### Step 1: Add Strand, keep Bootstrap

Install Strand and load both stylesheets. Strand classes use the `strand-` prefix so there are zero collisions with Bootstrap's `btn-`, `col-`, etc.

```html
<!-- Keep Bootstrap for now -->
<link rel="stylesheet" href="bootstrap.css">
<!-- Add Strand tokens + components -->
<link rel="stylesheet" href="@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="@dillingerstaffing/strand/css/base.css">
<link rel="stylesheet" href="strand-ui.css">
```

### Step 2: Migrate one component at a time

Start with buttons and forms since they are the most numerous. Replace Bootstrap classes with Strand classes using the mapping table above. Test each component before moving on.

```html
<!-- Before -->
<button class="btn btn-primary btn-lg">Submit</button>

<!-- After -->
<button class="strand-btn strand-btn--primary strand-btn--lg">Submit</button>
```

### Step 3: Replace variables and utilities

Replace Bootstrap Sass variables and `--bs-*` custom properties with Strand tokens. Replace utility classes with component-scoped CSS using Strand tokens.

```css
/* Before */
.header { color: var(--bs-primary); }

/* After */
.header { color: var(--strand-blue-primary); }
```

### Step 4: Audit accessibility

Strand components include focus-visible outlines, ARIA roles, and `prefers-reduced-motion` support. After migrating each page, run an accessibility check (axe-core or Lighthouse) to confirm WCAG 2.2 AA compliance.

### Step 5: Remove Bootstrap

Once all components are migrated and tested, remove Bootstrap and its JavaScript dependencies.

```bash
npm uninstall bootstrap @popperjs/core
```

Remove the Bootstrap `<link>` and `<script>` tags from your entry point. Run your full test suite. Ship.

## Further Reading

- [DESIGN_LANGUAGE.md](../../DESIGN_LANGUAGE.md) for token definitions and design principles
- [CONTRIBUTING.md](../../CONTRIBUTING.md) for component standards
