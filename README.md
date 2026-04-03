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

<p align="center">
    Official Website: https://dillingerstaffing.com/labs/strand
</p>

---

## Quick Start

### 1. Install

```bash
npm install @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

### 2. Import CSS (required)

Components are unstyled without these imports. Add them to your app entry point:

```css
@import '@dillingerstaffing/strand/css/reset.css';
@import '@dillingerstaffing/strand/css/tokens.css';
@import '@dillingerstaffing/strand/css/base.css';
@import '@dillingerstaffing/strand-ui/css/strand-ui.css';
```

### 3. Use components

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

---

## Framework Setup

### Preact (native)

Strand UI is built with Preact. No additional configuration needed.

```bash
npm install preact @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

### React

Strand UI works with React via Preact's compatibility layer. Add a bundler alias so `preact` resolves to `preact/compat`:

**Vite** (vite.config.ts):
```ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'preact': 'preact/compat',
      'preact/hooks': 'preact/hooks',
    },
  },
});
```

**Next.js** (next.config.js):
```js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'preact/compat': 'preact/compat',
      'preact': 'preact/compat',
    };
    return config;
  },
};
```

**webpack** (webpack.config.js):
```js
module.exports = {
  resolve: {
    alias: {
      'preact': 'preact/compat',
      'preact/hooks': 'preact/hooks',
    },
  },
};
```

In all cases, install preact alongside react:
```bash
npm install preact @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

---

## Tokens Only

Use the design system with any framework. No components, no runtime, no peer dependencies.

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

.label {
  font-family: var(--strand-font-mono);
  font-size: var(--strand-text-xs);
  letter-spacing: var(--strand-tracking-widest);
  text-transform: uppercase;
  color: var(--strand-gray-500);
}
```

Tokens are also available as typed JavaScript constants:

```ts
import { colors, spacing, typography } from '@dillingerstaffing/strand';
```

---

## Copy-Paste Components

Own the source. No dependency lock-in.

```bash
npx strand init          # Set up tokens in your project
npx strand add button    # Copy Button source to your codebase
npx strand add dialog    # Copy Dialog source to your codebase
npx strand list          # See all 31 components
```

Copies the full TypeScript source (.tsx + .css) into your project. Modify freely.

---

## Components

31 components across 5 categories. Every component includes: all interaction states, keyboard navigation, ARIA compliance, `prefers-reduced-motion` support, responsive behavior.

### Input

| Component | Description | Key Props |
|---|---|---|
| `Button` | Primary action trigger | `variant`: primary, secondary, ghost, danger. `size`: sm, md, lg. `loading`, `iconOnly`, `fullWidth` |
| `Input` | Single-line text entry | `type`: text, email, password, search, number. `error`, `leadingAddon`, `trailingAddon` |
| `Textarea` | Multi-line text entry | `autoResize`, `maxLength` (with character count) |
| `Select` | Option selection | `options`: SelectOption[]. `searchable`, `onChange` |
| `Checkbox` | Binary toggle (multiple) | `checked`, `indeterminate`, `onChange` |
| `Radio` | Single selection from set | `checked`, `name`, `value`, `onChange` |
| `Switch` | Binary toggle (single) | `checked`, `onChange`, inline label |
| `Slider` | Range value selection | `min`, `max`, `step`, `value`, `onChange` |
| `FormField` | Label + input + hint + error wrapper | `label`, `hint`, `error`, `required`. Wraps any input component |

### Display

| Component | Description | Key Props |
|---|---|---|
| `Card` | Content container | `variant`: elevated, outlined, interactive. `padding`: sm, md, lg |
| `Badge` | Status/count indicator | `variant`: dot, count. `status`: teal, blue, amber, red, default |
| `Avatar` | User/entity representation | `src`, `initials`, `size`: sm, md, lg, xl. Image/initials/icon fallback |
| `Tag` | Categorization label | `variant`: solid, outlined. `removable`, `onRemove`. Status colors |
| `Table` | Tabular data display | `columns`: TableColumn[]. `data`: T[]. Sortable headers, responsive scroll |
| `DataReadout` | Monospace metric display | `label` (overline), `value` (large display). The instrument readout pattern |

### Layout

| Component | Description | Key Props |
|---|---|---|
| `Stack` | Flex layout primitive | `direction`: vertical, horizontal. `gap`, `align`, `justify`, `wrap` |
| `Grid` | Grid layout primitive | `columns`, `gap`. Responsive column counts |
| `Container` | Width constraint | `width`: narrow (640px), default (768px), wide (1024px), full (1280px) |
| `Divider` | Visual separator | `direction`: horizontal, vertical. `label` (optional text in middle) |
| `Section` | Page section | `variant`: default, hero. Standard padding rhythm, background variants |

### Navigation

| Component | Description | Key Props |
|---|---|---|
| `Link` | Inline navigation | Standard anchor props. Underline-grow-from-left hover animation |
| `Tabs` | Content switching | `items`: TabItem[]. `activeIndex`, `onChange`. Full WAI-ARIA tabs pattern |
| `Breadcrumb` | Hierarchical location | `items`: BreadcrumbItem[]. `separator`. aria-current on last item |
| `Nav` | Site/app navigation | `children`, `logo`. Responsive hamburger collapse, focus trap on mobile |

### Feedback

| Component | Description | Key Props |
|---|---|---|
| `Toast` | Transient notification | `status`: info, success, warning, error. Use with `ToastProvider` + `useToast()` hook |
| `Alert` | Persistent notification | `status`: info, success, warning, error. `dismissible`, `onDismiss` |
| `Dialog` | Modal overlay | `open`, `onClose`, `title`. Focus trap, escape-to-close, portal rendering |
| `Tooltip` | Contextual hint | `content`, `position`: top, right, bottom, left. `delay` |
| `Progress` | Completion indicator | `variant`: bar, ring. `value` (0-100), `indeterminate` |
| `Spinner` | Loading indicator | `size`: sm, md, lg. Screen reader text included |
| `Skeleton` | Content placeholder | `variant`: text, rectangle, circle. `width`, `height`. Shimmer animation |

---

## Design Tokens Reference

### Surfaces
`--strand-surface-primary` (page bg) | `--strand-surface-elevated` (cards) | `--strand-surface-recessed` (inputs) | `--strand-surface-subtle` (borders)

### Blue Spectrum
`--strand-blue-glow` | `--strand-blue-wash` | `--strand-blue-indicator` | `--strand-blue-primary` | `--strand-blue-vivid` | `--strand-blue-deep` | `--strand-blue-midnight` | `--strand-blue-abyss`

### Typography
Fonts: `--strand-font-sans` (Inter) | `--strand-font-mono` (JetBrains Mono)
Scale: `--strand-text-xs` through `--strand-text-7xl` (Major Third 1.250 ratio)
Tracking: `--strand-tracking-tightest` through `--strand-tracking-ultra`

### Spacing
`--strand-space-1` (4px) through `--strand-space-48` (192px). Base unit: 4px.

### Motion
Easings: `--strand-ease-out-expo` | `--strand-ease-out-quart` | `--strand-ease-in-out-sine` | `--strand-ease-in-expo`
Durations: `--strand-duration-instant` (75ms) | `--strand-duration-fast` (150ms) | `--strand-duration-normal` (250ms) | `--strand-duration-slow` (400ms)

### Elevation
`--strand-elevation-0` through `--strand-elevation-4`. Cards at rest: level 1. Hover: level 2. Modals: level 3.

### Shape
`--strand-radius-sm` (4px) | `--strand-radius-md` (6px) | `--strand-radius-lg` (8px) | `--strand-radius-xl` (12px) | `--strand-radius-full` (9999px)

Full token specification: [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md)

---

## 10 Named Principles

Every design decision in Strand traces to one of 10 named principles. Each has a definition, a rationale, and a test.

| # | Principle | Core Idea |
|---|---|---|
| 1 | **Cognitive Economy** | Every element reduces the cognitive operations needed to understand the interface. If removing it doesn't break the task, it was decoration. |
| 2 | **Biosynthetic Restraint** | Clutter signals primitive. Space signals advanced. Max 12 visual elements per screen. |
| 3 | **Performance Gravity** | FCP < 1.2s. INP < 50ms. 60fps. No exceptions. Speed is the first and last design decision. |
| 4 | **The Blue Discipline** | Blue is earned by interactive, data, or status elements. Everything else is white and gray. |
| 5 | **Earned Elevation** | Shadow communicates z-layer and purpose. "It just looks nicer" means remove the shadow. |
| 6 | **Compound Silence** | Negative space communicates structure. Gap > padding, always. |
| 7 | **The Grain of Precision** | Subliminal texture (dot-grid, glow, grain) transforms blank white into a laboratory surface. |
| 8 | **Default Philosophy** | Defaults ARE the philosophy. Zero-config output must look like a precision laboratory, not a generic app. |
| 9 | **Typography Carries the Room** | If the interface works in grayscale with no images, the typography is correct. |
| 10 | **The Instrument Principle** | Every interface is an instrument in a laboratory. Forms are specimen instruments. Dashboards are analytical readouts. |

Full specification: [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md)

---

## Troubleshooting

**Components render without styles**
You must import the CSS files. See step 2 of Quick Start. All four CSS imports are required for the component library: reset.css, tokens.css, base.css, and strand-ui.css.

**Peer dependency warning for preact**
Install preact: `npm install preact`. Strand UI is built with Preact (3KB). If using React, you still need preact installed for the compatibility layer. See Framework Setup above.

**TypeScript errors with JSX**
Ensure your tsconfig.json includes `"jsxImportSource": "preact"` (or the appropriate alias if using React). Components export typed props interfaces for full IntelliSense.

**Copy-paste components need TypeScript**
The `strand add` command copies .tsx source files. For JavaScript projects, rename files from .tsx to .jsx and remove type annotations manually. TypeScript is recommended.

---

<p align="center">
  <a href="https://dillingerstaffing.com">Dillinger Staffing</a>
  &#183;
  <a href="./LICENSE">MIT License</a>
</p>
