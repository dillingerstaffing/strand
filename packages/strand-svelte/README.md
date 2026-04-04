# @dillingerstaffing/strand-svelte

Svelte component library built on the [Strand Design Language](https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md). 34 components. Zero-runtime CSS. WCAG 2.2 AA.

## Quick Start

```bash
npm install @dillingerstaffing/strand @dillingerstaffing/strand-svelte
```

Import CSS in your app entry point:

```css
@import '@dillingerstaffing/strand/css/reset.css';
@import '@dillingerstaffing/strand/css/tokens.css';
@import '@dillingerstaffing/strand/css/base.css';
@import '@dillingerstaffing/strand-svelte/css/strand-ui.css';
```

Use components:

```svelte
<script>
  import { Button, Card, Stack, Input } from '@dillingerstaffing/strand-svelte'
</script>

<Card variant="elevated" padding="lg">
  <Stack gap={4}>
    <Input placeholder="Enter your email" />
    <Button variant="primary">Get Started</Button>
  </Stack>
</Card>
```

## Components

34 components across 7 categories. Every component includes all interaction states, keyboard navigation, ARIA compliance, and `prefers-reduced-motion` support.

**Input:** Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, FormField
**Display:** Card, Badge, Avatar, Tag, Table, DataReadout, CodeBlock
**Layout:** Stack, Grid, Container, Divider, Section
**Navigation:** Link, Tabs, Breadcrumb, Nav
**Feedback:** Toast, Alert, Dialog, Tooltip, Progress, Spinner, Skeleton
**Surface:** InstrumentViewport
**Animation:** ScrollReveal

## Same CSS, Different Framework

This package produces identical visual output to [@dillingerstaffing/strand-ui](https://www.npmjs.com/package/@dillingerstaffing/strand-ui) (Preact/React). Same CSS classes, same ARIA attributes, same design tokens. The only difference is the framework binding.

## Links

- [GitHub](https://github.com/dillingerstaffing/strand)
- [Design Language](https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md)
- [HTML Reference (CSS-only API)](https://github.com/dillingerstaffing/strand/blob/main/HTML_REFERENCE.md)
- [Documentation](https://dillingerstaffing.com/labs/strand)

Created by [Dillinger Staffing](https://dillingerstaffing.com)
