# @dillingerstaffing/strand

Design tokens for the [Strand Design Language](https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md). CSS custom properties + typed JavaScript constants. Framework-agnostic. Zero runtime.

## Install

```bash
npm install @dillingerstaffing/strand
```

## CSS Tokens

```css
@import '@dillingerstaffing/strand/css/reset.css';
@import '@dillingerstaffing/strand/css/tokens.css';
@import '@dillingerstaffing/strand/css/base.css';
```

Use tokens in your CSS:

```css
.card {
  background: var(--strand-surface-elevated);
  border-radius: var(--strand-radius-lg);
  box-shadow: var(--strand-elevation-1);
  padding: var(--strand-space-6);
  color: var(--strand-gray-600);
  font-family: var(--strand-font-sans);
}
```

## JavaScript Tokens

```ts
import { colors, spacing, typography } from '@dillingerstaffing/strand';
```

## Bulma Integration

Make Bulma components adopt the Strand aesthetic:

```html
<link rel="stylesheet" href="@dillingerstaffing/strand/bulma/strand-bulma-compat.css">
```

Or in Sass: `@use "@dillingerstaffing/strand/bulma/strand-bulma-use"`. See [Using Strand with Bulma](https://github.com/dillingerstaffing/strand/blob/main/docs/migration/from-bulma.md).

## Links

- [GitHub](https://github.com/dillingerstaffing/strand)
- [Design Language](https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md)
- [Documentation](https://dillingerstaffing.com/labs/strand)

Created by [Dillinger Staffing](https://dillingerstaffing.com)
