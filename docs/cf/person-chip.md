# In a person chip the name never wraps, the secondary label yields first, and the initials are decorative

`.strand-person-chip` is one primitive rather than Avatar plus Tag because the circle's optical centre has to align with the name's baseline box. The initials are `aria-hidden`; the name is the accessible name. The name never wraps (a two-line pill breaks a wrapping strip's rhythm) and carries `min-inline-size: 0`; the secondary label carries `flex: none` up to a cap, so a narrow pill truncates the primary identifier only after the optional half has given up what it can. The separator between them is a `::before` with no colour of its own (a fill-tier grey there is a real 2.52:1 failure, since `content` is text to a contrast checker) and no markup, so it is not read aloud between two halves of one identity. The action form is a button, so it is reachable and announced as actionable.

Where: `packages/strand-ui/src/components/PersonChip/PersonChip.css`
