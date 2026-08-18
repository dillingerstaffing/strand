# The slider's field is the 44px hit area, and its thumb is a flat 20px disc

`.strand-slider__field` is a 44px-tall transparent hit area so the whole touch target is draggable; the visible track is painted on the field itself, since form controls take no pseudo-elements. The thumb is a flat 20px disc with no transparent border: the width-plus-transparent-border trick collapses to a hollow ring in WebKit, which does not honour `background-clip: padding-box` on the thumb pseudo-element. WebKit needs `margin-top: -7px` ((track height minus thumb height) / 2) to sit on the track; Firefox centres `::-moz-range-thumb` itself. Focus is a solid two-stop box-shadow ring (inner stop the surface colour) rather than an outline, because outline support on thumb pseudo-elements is uneven and the 10%-alpha ring token was not an indicator (SC 2.4.11).

Where: `packages/strand-ui/src/components/Slider/Slider.css`
