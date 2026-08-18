# Focus moves without scrolling, on open and on close

`focus()` scrolls its target into view by default. On OPEN the panel is fixed in the viewport, so there is nothing to scroll to; on CLOSE the restore target is whatever held focus before, and when that sits below the fold the default yanks the page down to it the instant the dialog dismisses. Every `focus()` in `Dialog` passes `{ preventScroll: true }`. Focus still moves for keyboard and assistive tech; only the viewport stays put. `initialFocus` names the element that takes focus on open; without it the first focusable child does, else the panel.

Where: `packages/strand-ui/src/components/Dialog/Dialog.tsx`
