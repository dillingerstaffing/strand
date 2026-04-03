# Using Strand with Bulma

Strand provides a Bulma theme. Bulma components adopt the Strand aesthetic through Bulma's own customization mechanisms. Pick the path that matches how you already customize Bulma.

---

## Path 1: CSS Variables (Bulma's recommended no-build approach)

Bulma's docs: [Customize with CSS variables](https://bulma.io/documentation/customize/with-css-variables/)

Load the Strand theme after Bulma. Bulma's `--bulma-*` variables resolve to Strand token values at runtime.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1/css/bulma.min.css">
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand/css/tokens.css">
<link rel="stylesheet" href="node_modules/@dillingerstaffing/strand/bulma/strand-bulma-compat.css">
```

That's it. Bulma buttons, cards, forms, navbars, modals -- everything renders with Strand's colors, typography, spacing, and border radii. No build step.

The theme also supports Bulma's scoped theming. Apply the Strand aesthetic to a section instead of the whole page:

```html
<div data-theme="strand">
  <!-- Bulma components here render with Strand aesthetic -->
  <button class="button is-primary">Strand-styled Bulma button</button>
</div>
```

Or with a CSS class: `<div class="theme-strand">`.

---

## Path 2: Sass (Bulma's recommended full-import approach)

Bulma's docs: [Customize with Sass](https://bulma.io/documentation/customize/with-sass/)

Bulma recommends `@use "bulma/sass" with (...)` to override variables at compile time. Strand provides a drop-in file that does this for you:

```scss
// my-project.scss
@use "@dillingerstaffing/strand/bulma/strand-bulma-use";
```

This single line replaces your `@use "bulma/sass"` import. It passes Strand's colors, fonts, radii, and grays into Bulma's `with()` clause. The compiled CSS has Strand values baked in -- no runtime variable overhead.

If you already have your own `@use "bulma/sass" with (...)`, merge Strand's variables into your existing overrides:

```scss
@use "@dillingerstaffing/strand/bulma/strand-bulma-vars" as strand;

@use "bulma/sass" with (
  $primary: strand.$strand-primary,
  $family-primary: strand.$strand-family-sans,
  $family-code: strand.$strand-family-mono,
  $grey-dark: strand.$strand-grey-dark,
  $radius: strand.$strand-radius,
  // ... your other overrides
);
```

---

## Path 3: Modular Sass (Bulma's recommended selective-import approach)

Bulma's docs: [Customize with modular Sass](https://bulma.io/documentation/customize/with-modular-sass/)

Import only the Bulma modules you need, with Strand's variables applied:

```scss
@use "@dillingerstaffing/strand/bulma/strand-bulma-vars" as strand;

// Override utilities with Strand values
@use "bulma/sass/utilities" with (
  $family-primary: strand.$strand-family-sans,
  $family-code: strand.$strand-family-mono,
  $primary: strand.$strand-primary,
  $link: strand.$strand-link,
  $grey-dark: strand.$strand-grey-dark,
  $grey-light: strand.$strand-grey-light,
  $radius: strand.$strand-radius
);

// Import only what you need
@forward "bulma/sass/base";
@forward "bulma/sass/elements/button";
@forward "bulma/sass/elements/tag";
@forward "bulma/sass/components/card";
@forward "bulma/sass/components/navbar";
@forward "bulma/sass/layout/section";

// Required: themes must be last
@forward "bulma/sass/themes";
```

---

## Path 4: Bulma Theme (Bulma's theme system)

Bulma's docs: [Themes](https://bulma.io/documentation/features/themes/)

A Bulma theme is a collection of CSS variables scoped to a selector. The Strand theme file (`strand-bulma-compat.css`) is a standard Bulma theme that applies at three scopes:

- `:root` -- global default
- `[data-theme="strand"]` -- scoped via HTML attribute
- `.theme-strand` -- scoped via CSS class

This is the same mechanism Bulma uses for its built-in light and dark themes.

---

## Using Strand Components Alongside Bulma

All paths above make Bulma's own components look like Strand. You can ALSO use Strand's component library directly for components Bulma doesn't have (DataReadout, CodeBlock, Progress ring) or where you want Strand's ARIA and keyboard handling:

```html
<!-- Bulma layout with Strand component inside -->
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
    </div>
  </div>
</section>
```

Zero class collisions. Bulma's `section`, `container`, `columns` handle layout. Strand's `strand-card` and `strand-data-readout` handle the component. Both CSS files coexist.

---

## Naming Convention

Bulma: `is-` modifiers (`button is-primary is-large`)
Strand: BEM `--` modifiers (`strand-btn strand-btn--primary strand-btn--lg`)

---

## Variable Reference

**CSS custom properties (runtime):**

| Bulma Variable | Strand Token |
|---|---|
| `--bulma-primary` | Derived from `--strand-blue-primary` |
| `--bulma-link` | Derived from `--strand-blue-primary` |
| `--bulma-success` | Derived from `--strand-teal-vital` |
| `--bulma-info` | Derived from `--strand-blue-indicator` |
| `--bulma-warning` | Derived from `--strand-amber-caution` |
| `--bulma-danger` | Derived from `--strand-red-alert` |
| `--bulma-text` | `var(--strand-gray-600)` |
| `--bulma-scheme-main` | `var(--strand-surface-primary)` |
| `--bulma-family-primary` | `var(--strand-font-sans)` |
| `--bulma-family-code` | `var(--strand-font-mono)` |
| `--bulma-radius` | `var(--strand-radius-md)` |
| `--bulma-shadow` | `var(--strand-elevation-1)` |

**Sass variables (compile time):**

| Bulma Sass | Strand Sass |
|---|---|
| `$primary` | `strand.$strand-primary` (#3B8EF6) |
| `$link` | `strand.$strand-link` (#3B8EF6) |
| `$success` | `strand.$strand-success` (#14B8A6) |
| `$warning` | `strand.$strand-warning` (#F59E0B) |
| `$danger` | `strand.$strand-danger` (#EF4444) |
| `$family-primary` | `strand.$strand-family-sans` (Inter) |
| `$family-code` | `strand.$strand-family-mono` (JetBrains Mono) |

---

## Dark Mode

Bulma supports dark mode via `prefers-color-scheme` and `[data-theme="dark"]`. Strand does not have an official dark theme. If your project uses Bulma dark mode, Strand components will stay light-themed.

Workaround: override Strand surface tokens in a dark scope:

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

This is a manual override, not an official theme. Test contrast ratios before shipping.

---

Full class API: [HTML_REFERENCE.md](../../HTML_REFERENCE.md)
Design principles: [DESIGN_LANGUAGE.md](../../DESIGN_LANGUAGE.md)
