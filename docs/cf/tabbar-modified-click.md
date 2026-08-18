# A tab bar destination stays a link, and only a plain click is owned

`TabBar` renders a destination with a `href` as an anchor so it keeps middle-click, open-in-new-tab and the status-bar preview. When `onNavigate` is supplied it must call `preventDefault()` on a plain primary click, or a client-side router sets its state and the browser hard-navigates on top of it. It must NOT prevent a modified click (`metaKey`, `ctrlKey`, `shiftKey`, `altKey`, or a non-primary button) and must not call `onNavigate` for one, because the current view is not the one changing.

Where: `packages/strand-ui/src/components/TabBar/TabBar.tsx`
