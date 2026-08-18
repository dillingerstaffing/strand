# CSS architecture

Strand ships one stylesheet, `dist/css/strand-ui.css`, assembled from small files with one owner each. This page is the whole set of rules for where a rule lives, how it is written, and how the build proves it. Every rule here is enforced by a script named beside it; nothing depends on remembering.

## Where a rule lives

There are five kinds of file, and a rule belongs to exactly one.

| Kind | Path | Holds | Owner check |
| --- | --- | --- | --- |
| Tokens | `packages/tokens/css/tokens.css` | Custom properties on `:root`. No selectors. | `pnpm test:parity` |
| Reset | `packages/tokens/css/reset.css` | Element defaults every page needs, including the one reduced-motion rule. | `pnpm audit-css-home` |
| Base | `packages/tokens/css/base.css` | Document defaults: `html`, `body`, headings, code, the one `:focus-visible` ring, `::selection`, scrollbars, metric-matched fallback faces, and `.strand-prose` (scoped element defaults for long-form content). | `pnpm audit-css-home` |
| Component | `packages/strand-ui/src/components/<Name>/<Name>.css` | Every rule for the block named by the directory: `.strand-<name>`, its elements `__x` and modifiers `--y`. A directory with a component renders those classes; a directory without one is a class-only primitive declared in `parity-manifest.json#/cssOnlyComponents` with its blocks. | `pnpm audit-css-home`, `pnpm test:css-export-parity` |
| Sheets after components | `packages/strand-ui/src/typography.css`, `utilities.css`, `static.css` | Standalone classes no component owns: text styles, single-purpose utilities, and the presentation mode. | `pnpm audit-css-home` |

The test for "is this global or local" is one question: **does a component directory own the block this selector defines?** If yes, the rule lives there and nowhere else. If no block owns it and it is a text style, it is typography; a single-property helper, a utility; otherwise it is a class-only primitive that gets its own directory and a manifest entry. `base.css` never defines a `.strand-` block except `.strand-prose`; a class on `body` or `html` there is a document mode, not a block.

The bundle order is explicit in `packages/strand-ui/vite.config.ts`: every component sheet in code-point order, then typography, utilities and static. Order between files is never load-bearing: `pnpm css-move-guard <before> <after>` fails a change that swaps two rules which can meet on one element at equal specificity and disagree. Two blocks meet when a selector puts them on one element, and also when a known source composes them on one element: the library's own sources and each consumer's recorded class pairs in `consumer-usage.json` (`pnpm css-usage --export-consumer` records them, so `.strand-empty-collection__action` on a `.strand-link` is a meeting the guard sees).

## How a rule is written

1. **One block per file, one file per block.** A sheet defines only its own block. `.strand-card` does not style `.strand-btn`, and `Card.css` does not define `.strand-channel-grid`. `pnpm test:css-export-parity` fails an undeclared foreign block; the two recorded exceptions carry their reasons in the manifest.
2. **A surface recolours through tokens, never by selector.** A dark surface (`.strand-instrument-viewport`, `.strand-body--instrument`, `.strand-feature-surface`) or a recessed one sets `--strand-<block>-<part>-<property>` custom properties on itself; the primitive reads them with its light value as the fallback (`color: var(--strand-overline-color, var(--strand-gray-500))`). A light island (`.strand-detail-panel`, `.strand-surface-light`) resets each token to `initial`. `.strand-instrument-viewport .strand-overline { color }` is the shape this replaces, because that shape wins by file order and specificity, and it is now a failing check in `pnpm audit-css-home`. See `docs/cf/surface-tokens.md`.
3. **A geometry a consumer needs to set is a knob.** `--strand-search-field-inline-size`, `--strand-btn-min-block-size` and their siblings are custom properties whose fallback is exactly what shipped, read inside `var()`, never declared on the block. See `docs/cf/component-knobs.md`.
4. **State is an attribute where the platform has one.** `[aria-current="page"]`, `[aria-pressed="true"]`, `[aria-checked="true"]`, `[data-strand-reserve="ready"]`, `:checked`, `:indeterminate`, `:disabled`. A wrapper with no state of its own reads its control through `:has()`. A class exists for a state only when no attribute carries it, so the painted state and the announced state cannot drift. See `docs/cf/native-state-selectors.md`.
5. **Each declaration exists once.** The focus ring lives in `base.css`; reduced motion lives in `reset.css`; disabled opacity is `--strand-opacity-disabled`. A component restates none of them. `!important` appears only where the contract is that a composed utility wins (`.strand-value--positive`), where the presentation mode must beat everything (`.strand-static`), or to outrank a third-party stylesheet appended at runtime.
6. **Every rule is used.** A rule stays only if a component renders it, a consumer emits it, a showcase demonstrates it, or the design language or a migration guide specifies it. `pnpm test:css-usage` judges every selector branch against the library's sources plus `consumer-usage.json`, which each consumer writes from inside its own checkout (`pnpm css-usage --export-consumer <name> --corpus <dir>...`), and fails on anything unreachable.
7. **A sheet carries rules, not essays.** A stylesheet is the license banner, `/* cf: <slug> */` pointers, one-line section labels, and rules. Anything that would take a paragraph to justify is an article in `docs/cf/` that the sheet points at; `pnpm cf-check` fails a pointer without an article and an article nothing points at.
8. **A stylesheet is code.** Every sheet has a rules snapshot (`test/stylesheet.ts`): the sheet parsed to selectors and declarations, so any change to what a browser reads is a reviewed diff. Formatting is two-space indent, one rule per block, one blank line between rules, long comma lists wrapped one item per line.

## What is deliberately not here

- **No cascade layers.** `@layer` would let unlayered consumer CSS beat every library rule regardless of specificity, which changes what existing consumers see. Order is explicit and guarded instead.
- **No preprocessor, no nesting.** What is in the file is what the browser reads.
- **No per-page or per-consumer rules.** A consumer that must override a library class has found a library gap; the answer is a knob, a token or a primitive here.

## The checks, in one place

| Command | Proves |
| --- | --- |
| `pnpm audit-css-home` | every block is defined in the directory that owns it; no surface recolours by selector |
| `pnpm test:css-export-parity` | every stylesheet is reachable by a consumer; no undeclared foreign block |
| `pnpm test:css-usage` | no rule matches nothing any known source emits |
| `pnpm css-move-guard <before> <after>` | a move lost no rule and swapped no colliding pair |
| `pnpm cf-check` | every pointer has an article; every article is pointed at |
| `pnpm test:contrast`, `test:dark-composition`, `test:doc-contrast` | every text colour meets its threshold on the surfaces it is painted on |
| `pnpm test:layout` | the geometry claims a unit test cannot evaluate, in a real browser |
| stylesheet snapshots (`pnpm test`) | what each sheet renders, rule by rule |
