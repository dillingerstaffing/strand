# Using Strand with Bulma

Strand and Bulma coexist without conflicts. All Strand classes use the `strand-` prefix. Bulma classes are unprefixed (`button`, `columns`, `field`). Zero collisions. Load both CSS files and use each where you want.

## Setup

```html
<!-- Bulma (your existing CSS) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1/css/bulma.min.css">

<!-- Strand tokens + components -->
<link rel="stylesheet" href="path/to/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="path/to/@dillingerstaffing/strand-ui/dist/css/strand-ui.css">
```

Both load. No conflicts. Use Bulma for layout, Strand for components, or mix freely.

## Naming Convention Shift

Bulma uses `is-` modifiers: `button is-primary is-large`
Strand uses BEM `--` modifiers: `strand-btn strand-btn--primary strand-btn--lg`

This pattern applies to every component. Once you see it, you can self-translate any Bulma class to its Strand equivalent.

## Practical Example: Bulma Layout + Strand Components

```html
<!-- Bulma responsive grid with Strand cards inside -->
<section class="section">
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-half-tablet is-one-third-desktop">
        <div class="strand-card strand-card--elevated strand-card--pad-md">
          <div class="strand-data-readout strand-data-readout--sm">
            <span class="strand-data-readout__label">Revenue</span>
            <span class="strand-data-readout__value">$94K</span>
          </div>
        </div>
      </div>
      <div class="column is-half-tablet is-one-third-desktop">
        <div class="strand-card strand-card--elevated strand-card--pad-md">
          <div class="strand-data-readout strand-data-readout--sm">
            <span class="strand-data-readout__label">Users</span>
            <span class="strand-data-readout__value">12.8K</span>
          </div>
        </div>
      </div>
      <div class="column is-half-tablet is-one-third-desktop">
        <div class="strand-card strand-card--elevated strand-card--pad-md">
          <div class="strand-data-readout strand-data-readout--sm">
            <span class="strand-data-readout__label">Uptime</span>
            <span class="strand-data-readout__value">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Bulma's `section`, `container`, and `columns` handle the layout. Strand's `strand-card` and `strand-data-readout` handle the component visuals. No interference.

## Form Pattern Comparison

Bulma and Strand both wrap form controls. The structure differs:

**Bulma form:**
```html
<div class="field">
  <label class="label">Email</label>
  <div class="control">
    <input class="input" type="email" placeholder="you@example.com">
  </div>
  <p class="help">We will never share your email.</p>
</div>
```

**Strand form (inside Bulma layout):**
```html
<div class="column">
  <div class="strand-form-field">
    <label class="strand-form-field__label" for="email">Email</label>
    <div class="strand-form-field__control">
      <div class="strand-input">
        <input id="email" class="strand-input__field" type="email" placeholder="you@example.com">
      </div>
    </div>
    <p class="strand-form-field__hint">We will never share your email.</p>
  </div>
</div>
```

Key differences: Strand wraps `<input>` in a `strand-input` div (for addon support). Strand labels use monospace uppercase tracking. Strand uses `strand-form-field__hint` instead of `help`.

## Class Mapping

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
| `field` + `label` + `control` | `strand-form-field` + `__label` + `__control` | See form comparison above |
| `help` | `strand-form-field__hint` or `__error` | |
| `notification is-success` | `strand-alert strand-alert--success` | |
| `tag is-info` | `strand-tag strand-tag--solid strand-tag--blue` | |
| `table` | `strand-table-wrapper` + `strand-table` | Wrapper for scroll |
| `modal` | `strand-dialog__backdrop` + `strand-dialog__panel` | |
| `progress` | `strand-progress strand-progress--bar` | |
| `tabs` | `strand-tabs` | See HTML_REFERENCE.md |
| `navbar` | `strand-nav` | See HTML_REFERENCE.md |
| `breadcrumb` | `strand-breadcrumb` | See HTML_REFERENCE.md |

## Variable Mapping

Bulma v1 uses both Sass variables and `--bulma-` CSS custom properties. Strand uses `--strand-` CSS custom properties.

**CSS custom properties (Bulma v1 -> Strand):**

| Bulma CSS Variable | Strand Token |
|---|---|
| `--bulma-primary` | `--strand-blue-primary` |
| `--bulma-link` | `--strand-blue-primary` |
| `--bulma-info` | `--strand-blue-indicator` |
| `--bulma-success` | `--strand-teal-vital` |
| `--bulma-warning` | `--strand-amber-caution` |
| `--bulma-danger` | `--strand-red-alert` |
| `--bulma-text` | `--strand-gray-600` |
| `--bulma-text-strong` | `--strand-gray-800` |
| `--bulma-background` | `--strand-surface-primary` |
| `--bulma-border` | `--strand-gray-200` |
| `--bulma-family-primary` | `--strand-font-sans` |
| `--bulma-family-code` | `--strand-font-mono` |
| `--bulma-radius` | `--strand-radius-md` |
| `--bulma-radius-small` | `--strand-radius-sm` |
| `--bulma-radius-large` | `--strand-radius-lg` |
| `--bulma-size-small` | `--strand-text-sm` |
| `--bulma-size-normal` | `--strand-text-base` |
| `--bulma-size-medium` | `--strand-text-lg` |

**Sass variables (for build-time customization):**

| Bulma Sass | Strand Token |
|---|---|
| `$primary` | `--strand-blue-primary` |
| `$info` | `--strand-blue-indicator` |
| `$success` | `--strand-teal-vital` |
| `$warning` | `--strand-amber-caution` |
| `$danger` | `--strand-red-alert` |

## Layout: What to Keep vs What to Replace

| Bulma Layout | Recommendation |
|---|---|
| `columns` + `column is-X` | **Keep.** Bulma's responsive grid works well. Use Strand components inside columns. |
| `section` | **Keep or replace.** Both work. Strand's `strand-section` adds the laboratory padding rhythm. |
| `container` | **Keep or replace.** Strand's `strand-container` has 4 width tiers (narrow/default/wide/full). |
| `hero` | **Keep.** No Strand equivalent. |
| `footer` | **Keep.** No Strand equivalent. |
| `level` | **Keep.** No direct Strand equivalent. Use `strand-stack--horizontal` for similar flex layouts. |
| `navbar` | **Replace with `strand-nav`** if you want the Strand aesthetic. Or keep Bulma's. |

## Dark Mode

Bulma v1 supports dark mode via `prefers-color-scheme` and `[data-theme]` attributes. Strand does not currently have a dark mode. If your Bulma project uses dark mode:

- Bulma layout elements (section, columns, hero) will switch to dark
- Strand components will remain light-themed
- This creates a visual mismatch in dark mode

**Workaround:** Override Strand surface tokens in your dark theme scope:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --strand-surface-primary: #1a1a2e;
    --strand-surface-elevated: #16213e;
    --strand-surface-recessed: #0f0f23;
    --strand-gray-600: #cbd6e1;
    --strand-blue-midnight: #e2e9f0;
  }
}
```

This is a manual override, not an official Strand dark theme. Use with caution and test contrast ratios.

## When to Use Which

- **Bulma layout** (columns, hero, section, container, footer) -- keep if your page structure is built with Bulma
- **Strand components** (buttons, cards, forms, alerts, dialogs, data readouts, code blocks) -- use for the Strand design language quality
- **Strand tokens** (colors, spacing, typography) -- use in your own custom CSS for consistency with Strand components
- **Both simultaneously** -- a Bulma column containing a Strand card is the expected pattern

Full class API: [HTML_REFERENCE.md](../../HTML_REFERENCE.md)
Design principles: [DESIGN_LANGUAGE.md](../../DESIGN_LANGUAGE.md)
