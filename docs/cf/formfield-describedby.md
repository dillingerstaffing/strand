# The control is described in the same render that shows the message

`FormField` hands its wrapped control the id of whichever message is showing by cloning the child with `aria-describedby`, never by writing the attribute to the DOM in an effect. The control re-renders on every keystroke and an attribute the renderer did not set survives only by luck of the diff; describing the child in the returned tree lands in the same commit as the message, so the two cannot disagree. A caller's own `aria-describedby` is kept and the message id appended.

Where: `packages/strand-ui/src/components/FormField/FormField.tsx`
