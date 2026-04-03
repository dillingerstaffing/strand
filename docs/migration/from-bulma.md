# Using Strand with Bulma

Strand and Bulma coexist without conflicts. All Strand classes are prefixed with `strand-`, so there are zero class name collisions. Add Strand components to your Bulma project alongside your existing Bulma layout and utilities.

## Setup

Install Strand alongside Bulma. Both CSS files load on the same page:

```html
<!-- Bulma (your existing CSS) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1/css/bulma.min.css">

<!-- Strand tokens + components -->
<link rel="stylesheet" href="path/to/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="path/to/@dillingerstaffing/strand-ui/dist/css/strand-ui.css">
```

Use Bulma for layout, Strand for components, or mix freely:

```html
<!-- Bulma grid with Strand components inside -->
<div class="columns">
  <div class="column is-half">
    <div class="strand-card strand-card--elevated strand-card--pad-md">
      <div class="strand-data-readout strand-data-readout--sm">
        <span class="strand-data-readout__label">Revenue</span>
        <span class="strand-data-readout__value">$94K</span>
      </div>
    </div>
  </div>
  <div class="column is-half">
    <div class="strand-form-field">
      <label class="strand-form-field__label" for="email">Email</label>
      <div class="strand-form-field__control">
        <div class="strand-input">
          <input id="email" class="strand-input__field" type="email" placeholder="you@example.com">
        </div>
      </div>
    </div>
  </div>
</div>
```

## Class Reference (Bulma -> Strand Equivalents)

When you want to replace a Bulma component with its Strand equivalent:

| Bulma | Strand | Notes |
|-------|--------|-------|
| `button is-primary` | `strand-btn strand-btn--primary strand-btn--md` | BEM with explicit size |
| `button is-danger` | `strand-btn strand-btn--danger strand-btn--md` | |
| `button is-light` | `strand-btn strand-btn--secondary strand-btn--md` | |
| `button is-ghost` | `strand-btn strand-btn--ghost strand-btn--md` | |
| `button is-loading` | `strand-btn strand-btn--loading strand-btn--md` | Add spinner span inside |
| `card` | `strand-card strand-card--elevated strand-card--pad-md` | Requires variant + padding |
| `input` | `strand-input` wrapper + `strand-input__field` | Wrapper div required |
| `textarea` | `strand-textarea` wrapper + `strand-textarea__field` | |
| `select` | `strand-select` wrapper + `strand-select__field` | + arrow span |
| `field` + `label` | `strand-form-field` + `strand-form-field__label` | |
| `notification is-success` | `strand-alert strand-alert--success` | |
| `tag is-info` | `strand-tag strand-tag--solid strand-tag--blue` | |
| `table` | `strand-table-wrapper` + `strand-table` | Wrapper for scroll |
| `modal` | `strand-dialog__backdrop` + `strand-dialog__panel` | |
| `progress` | `strand-progress strand-progress--bar` | |
| `tabs` | `strand-tabs` | See HTML_REFERENCE.md |
| `navbar` | `strand-nav` | See HTML_REFERENCE.md |

## Variable Mapping

Strand design tokens are CSS custom properties. Use them in your own CSS alongside Bulma:

| Bulma Sass | Strand Token |
|------------|-------------|
| `$primary` | `--strand-blue-primary` |
| `$info` | `--strand-blue-indicator` |
| `$success` | `--strand-teal-vital` |
| `$warning` | `--strand-amber-caution` |
| `$danger` | `--strand-red-alert` |
| `$text` | `--strand-gray-600` |
| `$link` | `--strand-blue-primary` |

## When to Use Which

- **Bulma layout** (columns, tiles, hero, container) -- keep using these if your page structure is built with Bulma
- **Strand components** (buttons, cards, forms, alerts, dialogs, data readouts) -- use these when you want the Strand design language quality
- **Strand tokens** (colors, spacing, typography) -- use in your own custom CSS for consistency with Strand components

Full class API: [HTML_REFERENCE.md](../../HTML_REFERENCE.md)
Design principles: [DESIGN_LANGUAGE.md](../../DESIGN_LANGUAGE.md)
