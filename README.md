<p align="center">
  <strong>S T R A N D</strong>
</p>

<p align="center">
  Design tokens + UI components. Zero-runtime CSS. Ship faster.
</p>

<p align="center">
  <a href="./DESIGN_LANGUAGE.md">Design Language</a> &#183;
  <a href="./CONTRIBUTING.md">Contributing</a> &#183;
  <a href="https://github.com/dillingerstaffing/strand/issues">Issues</a>
</p>

---

## Install

```bash
npm install @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

## Use

```css
/* Import the foundation */
@import '@dillingerstaffing/strand/css/reset.css';
@import '@dillingerstaffing/strand/css/tokens.css';
@import '@dillingerstaffing/strand/css/base.css';
```

```jsx
import { Button, Input, Card, Stack } from '@dillingerstaffing/strand-ui';

function App() {
  return (
    <Card variant="elevated" padding="lg">
      <Stack gap={4}>
        <Input placeholder="Enter your email" />
        <Button>Get Started</Button>
      </Stack>
    </Card>
  );
}
```

That's it. You're building.

---

## Tokens only

Use the design system with any framework. No components required.

```bash
npm install @dillingerstaffing/strand
```

```css
@import '@dillingerstaffing/strand/css/tokens.css';

.card {
  background: var(--strand-surface-elevated);
  border-radius: var(--strand-radius-lg);
  box-shadow: var(--strand-elevation-1);
  padding: var(--strand-space-6);
}

.title {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-xs);
  letter-spacing: var(--strand-tracking-widest);
  text-transform: uppercase;
  color: var(--strand-gray-500);
}
```

Tokens are also available as typed constants:

```ts
import { colors, spacing, typography } from '@dillingerstaffing/strand';
```

---

## Copy-paste components

Own the source. No dependency lock-in.

```bash
npx strand init          # Set up tokens in your project
npx strand add button    # Copy Button source to your codebase
npx strand add dialog    # Copy Dialog source to your codebase
npx strand list           # See all 31 components
```

---

## Components

31 components. Every interaction state. Keyboard accessible. ARIA compliant. `prefers-reduced-motion` supported.

**Input** &mdash; Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, FormField

**Display** &mdash; Card, Badge, Avatar, Tag, Table, DataReadout

**Layout** &mdash; Stack, Grid, Container, Divider, Section

**Navigation** &mdash; Link, Tabs, Breadcrumb, Nav

**Feedback** &mdash; Toast, Alert, Dialog, Tooltip, Progress, Spinner, Skeleton

---

## What this is

Strand is a design language with a specific point of view. Clean surfaces. Cool-shifted whites. A single blue accent. Typography that does 80% of the work. Performance as design.

Everything traces back to the [design language specification](./DESIGN_LANGUAGE.md): color, typography, spacing, motion, elevation, shape, layout, accessibility, and component interaction patterns.

**Zero-runtime CSS.** All tokens are CSS custom properties. No ThemeProvider. No CSS-in-JS. No runtime style computation.

**Framework-agnostic tokens.** CSS custom properties work everywhere. The component library targets Preact/React. The tokens work with anything.

**WCAG 2.2 AA.** Every color pairing passes contrast. Every component is keyboard-navigable. Every animation respects `prefers-reduced-motion`.

**< 50KB gzipped.** The entire component library. Static CSS. Tree-shakeable exports.

---

<p align="center">
  <a href="https://dillingerstaffing.com">Dillinger Staffing</a>
  &#183;
  <a href="./LICENSE">MIT License</a>
</p>
