# The gap prop is a rung, and an off-ladder value is clamped, never dropped

`Stack` and `Grid` take `gap` from the spacing ladder (design language Part V 5.1). The ladder is sparse on purpose, so a value it lacks used to render NO gap: Stack emitted a class with no rule, and Grid wrote `gap: var(--strand-space-7)`, and an undefined custom property invalidates the whole declaration. `resolveGap` clamps to the nearest rung (ties go down, because a smaller gap cannot overflow) and `warnOffLadderGap` says so once in development. Extending the ladder is a design-language change; honouring it is a library one.

Where: `packages/strand-ui/src/spacing.ts`, `Stack.tsx`, `Grid.tsx`
