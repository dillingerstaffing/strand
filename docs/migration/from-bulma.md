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

<!-- GENERATED:BULMA-CSS-VARS:START -->
| Bulma Variable | Strand Token |
|---|---|
| `--bulma-primary-h` | `213deg` |
| `--bulma-primary-s` | `91%` |
| `--bulma-primary-l` | `60%` |
| `--bulma-link-h` | `213deg` |
| `--bulma-link-s` | `91%` |
| `--bulma-link-l` | `60%` |
| `--bulma-info-h` | `207deg` |
| `--bulma-info-s` | `96%` |
| `--bulma-info-l` | `78%` |
| `--bulma-success-h` | `173deg` |
| `--bulma-success-s` | `80%` |
| `--bulma-success-l` | `40%` |
| `--bulma-warning-h` | `38deg` |
| `--bulma-warning-s` | `92%` |
| `--bulma-warning-l` | `50%` |
| `--bulma-danger-h` | `0deg` |
| `--bulma-danger-s` | `84%` |
| `--bulma-danger-l` | `60%` |
| `--bulma-scheme-h` | `220` |
| `--bulma-scheme-s` | `100%` |
| `--bulma-scheme-main` | `var(--strand-surface-primary)` |
| `--bulma-scheme-main-bis` | `var(--strand-surface-recessed)` |
| `--bulma-scheme-main-ter` | `var(--strand-surface-subtle)` |
| `--bulma-text` | `var(--strand-gray-600)` |
| `--bulma-text-strong` | `var(--strand-gray-800)` |
| `--bulma-text-weak` | `var(--strand-gray-500)` |
| `--bulma-family-primary` | `var(--strand-font-sans)` |
| `--bulma-family-secondary` | `var(--strand-font-sans)` |
| `--bulma-family-code` | `var(--strand-font-mono)` |
| `--bulma-size-small` | `0.833rem` |
| `--bulma-size-normal` | `1rem` |
| `--bulma-size-medium` | `1.25rem` |
| `--bulma-size-large` | `1.563rem` |
| `--bulma-weight-light` | `300` |
| `--bulma-weight-normal` | `400` |
| `--bulma-weight-medium` | `500` |
| `--bulma-weight-semibold` | `600` |
| `--bulma-weight-bold` | `700` |
| `--bulma-border` | `var(--strand-gray-200)` |
| `--bulma-border-weak` | `var(--strand-surface-subtle)` |
| `--bulma-radius-small` | `var(--strand-radius-sm)` |
| `--bulma-radius` | `var(--strand-radius-md)` |
| `--bulma-radius-medium` | `var(--strand-radius-lg)` |
| `--bulma-radius-large` | `var(--strand-radius-xl)` |
| `--bulma-radius-rounded` | `var(--strand-radius-full)` |
| `--bulma-block-spacing` | `var(--strand-space-6)` |
| `--bulma-gap` | `var(--strand-space-8)` |
| `--bulma-shadow` | `var(--strand-elevation-1)` |
| `--bulma-focus-h` | `213deg` |
| `--bulma-focus-s` | `91%` |
| `--bulma-focus-l` | `60%` |
| `--bulma-duration` | `250ms` |
| `--bulma-easing` | `cubic-bezier(0.25, 1, 0.5, 1)` |
<!-- GENERATED:BULMA-CSS-VARS:END -->

**Sass variables (compile time):**

<!-- GENERATED:BULMA-SASS-VARS:START -->
| Sass Variable | Value | Maps To |
|---|---|---|
| `$primary` | `$strand-primary, ...)` | ── Colors ── |
| `$strand-primary` | `#3B8EF6` | --strand-blue-primary |
| `$strand-link` | `#3B8EF6` | --strand-blue-primary |
| `$strand-info` | `#93CCFD` | --strand-blue-indicator |
| `$strand-success` | `#14B8A6` | --strand-teal-vital |
| `$strand-warning` | `#F59E0B` | --strand-amber-caution |
| `$strand-danger` | `#EF4444` | --strand-red-alert |
| `$strand-black` | `#0F192A` | --strand-blue-abyss |
| `$strand-grey-darker` | `#1E2B3B` | --strand-gray-800 |
| `$strand-grey-dark` | `#334355` | --strand-gray-700 |
| `$strand-grey` | `#64778B` | --strand-gray-500 |
| `$strand-grey-light` | `#94A5B8` | --strand-gray-400 |
| `$strand-grey-lighter` | `#CBD6E1` | --strand-gray-300 |
| `$strand-grey-lightest` | `#E2E9F0` | --strand-gray-200 |
| `$strand-white-ter` | `#F0F5F8` | --strand-surface-recessed |
| `$strand-white-bis` | `#F7FAFD` | --strand-gray-50 |
| `$strand-white` | `#FAFCFF` | --strand-surface-primary |
| `$strand-family-sans` | `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif` |  |
| `$strand-family-mono` | `"JetBrains Mono", "SF Mono", "Fira Code", "Cascadia Code", monospace` | ── Border Radius ── |
| `$strand-radius-small` | `4px` | --strand-radius-sm |
| `$strand-radius` | `6px` | --strand-radius-md |
| `$strand-radius-medium` | `8px` | --strand-radius-lg |
| `$strand-radius-large` | `12px` | --strand-radius-xl |
| `$strand-duration` | `250ms` |  |
| `$strand-easing` | `cubic-bezier(0.25, 1, 0.5, 1)` |  |
<!-- GENERATED:BULMA-SASS-VARS:END -->

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
