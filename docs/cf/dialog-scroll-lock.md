# The scroll lock runs before paint and pays back the scrollbar it removes

Hiding `overflow` on the body removes the scrollbar, and on a page tall enough to have one that widens the viewport by the scrollbar's width and shifts the whole app sideways. Overlay-scrollbar platforms measure that gap as 0, which is how the defect ships. `scrollbar-gutter: stable` cannot fix it: the gutter is only reserved while overflow is scroll or auto, so the same `overflow: hidden` voids the reservation.

The lock therefore measures the gap (`window.innerWidth - documentElement.clientWidth`), pads the body by it, publishes it as `--strand-scrollbar-gap` on the root for `position: fixed` chrome that body padding cannot reach, and hides overflow on the BODY only. Every write is restored on close, including a pre-existing `--strand-scrollbar-gap`.

It runs in a LAYOUT effect. A passive effect runs after paint, so the panel's first frame is composed against a viewport that still holds the scrollbar and a centred panel re-centres by half the gap one frame later. A zero `clientWidth` means no layout engine (jsdom, some embeds) and nothing is compensated.

Where: `packages/strand-ui/src/components/Dialog/Dialog.tsx`
