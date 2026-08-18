# Component patterns

Every component in `packages/strand-ui` is written the same way, so a reader who knows one knows all of them. The patterns are the plain function-component patterns; the list below names each one, where it is used, and what would count as a violation. `pnpm audit-components` reports the mechanical facts (hooks, state, effects, DOM reach, comment lines) per component.

## The patterns

1. **Function component, props destructured, rest spread onto the root.** `({ variant = "primary", className = "", children, ...rest }, ref) => <button ref={ref} className={cx("strand-btn", ...)} {...rest}>`. Defaults live in the destructuring. Every attribute a consumer passes reaches the root, so `aria-*`, `data-*` and event handlers need no plumbing.
2. **Class composition with `cx`.** `cx("strand-btn", `strand-btn--${variant}`, disabled && "strand-btn--disabled", className)`; falsy parts drop out. No string concatenation, no ternaries producing `""`.
3. **Conditional rendering by expression.** `{icon && <span className="strand-btn__icon">{icon}</span>}`; a branch that renders nothing renders `null`.
4. **Children pass-through and proxy.** A component that wraps content renders `{children}` where they belong; `FormField` clones its child control to attach `id`, `aria-describedby` and `aria-invalid` rather than asking the consumer to wire them.
5. **Render props for per-item content.** `CalendarGrid` takes `renderDay(day)` so a consumer decides what a cell holds without the grid knowing.
6. **Style components for a family of thin wrappers.** `styled(tag, baseClass, displayName)` produces the `Lab*` specimen family (`LabShell`, `LabSidebar`, `LabExample`, ...) as one-line declarations; each is a `forwardRef` function component that merges `className` and spreads the rest.
7. **Controlled inputs and state hoisting.** `Checkbox`, `Switch`, `Radio`, `Select`, `Input`, `Textarea`, `Slider` and `StarRating` take `value`/`checked` and `onChange`; the component holds no copy of the value. `Tabs`, `ChipSet` and `Nav` hoist their selection to the consumer through the same shape.
8. **Ids from `useId`.** `Dialog` and `Tooltip` mint their `aria-labelledby` and `aria-describedby` ids with `useId`, so ids never depend on render order.
9. **Effects for the platform, not for rendering.** State that decides markup lives in `useState` and renders as classes or attributes (`ScrollReveal` renders `--visible`; `Toast` renders its list). Effects exist only to subscribe to something the platform owns: an `IntersectionObserver`, a timer, `document.body` overflow for a scroll lock.
10. **Refs last.** A ref is used only where the DOM has no declarative form: restoring focus when a dialog closes, measuring a textarea's `scrollHeight` to autosize it, moving focus between tabs and calendar cells (roving tabindex), scrolling an active command-palette option into view, and reading the dock's trigger position. Each is named in `docs/cf/` (`dialog-focus-restore`, `dialog-scroll-lock`, `calendar-grid-arithmetic`, `actiondock-reveal`, `sheet-pointer-capture`). Nothing sets a class or a style on a node it did not render.

## What a component file does not contain

- Prose. A `/** one-line */` JSDoc on the export and on each prop; anything longer is an article in `docs/cf/` the file points at with `// cf: <slug>`.
- A DOM query. `document.querySelector`, `element.classList` and `style.x =` do not appear; the render tree is the only writer of markup.
- A copy of state the consumer owns.
- A CSS import. Styles ship in the class layer for every consumer type; see [CSS architecture](./css-architecture.md).

## How a component is tested

- `Component.fixtures.ts` names the prop sets worth rendering; `snapshotFixtures` renders each and snapshots the HTML.
- `snapshotStylesheet` snapshots the component's rules.
- Behaviour tests read as what a user sees: "clicking the hamburger opens the menu and updates aria-expanded", never "has class strand-nav--open".
