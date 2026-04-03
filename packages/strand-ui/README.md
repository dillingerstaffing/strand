# @dillingerstaffing/strand-ui

Preact/React component library built on the [Strand Design Language](https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md). 32 components. Zero-runtime CSS. WCAG 2.2 AA.

## Install

```bash
npm install @dillingerstaffing/strand @dillingerstaffing/strand-ui
```

Import CSS in your app entry point:

```css
@import '@dillingerstaffing/strand/css/reset.css';
@import '@dillingerstaffing/strand/css/tokens.css';
@import '@dillingerstaffing/strand/css/base.css';
@import '@dillingerstaffing/strand-ui/css/strand-ui.css';
```

Use components:

```jsx
import { Button, Card, Stack, Input } from '@dillingerstaffing/strand-ui';

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

## Also Available

- **Vue 3:** [@dillingerstaffing/strand-vue](https://www.npmjs.com/package/@dillingerstaffing/strand-vue)
- **Svelte:** [@dillingerstaffing/strand-svelte](https://www.npmjs.com/package/@dillingerstaffing/strand-svelte)
- **CSS Only:** Use classes directly per [HTML_REFERENCE.md](https://github.com/dillingerstaffing/strand/blob/main/HTML_REFERENCE.md)

## Links

- [GitHub](https://github.com/dillingerstaffing/strand)
- [Design Language](https://github.com/dillingerstaffing/strand/blob/main/DESIGN_LANGUAGE.md)
- [Documentation](https://dillingerstaffing.com/labs/strand)

Created by [Dillinger Staffing](https://dillingerstaffing.com)
