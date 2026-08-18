# The required mark is an accent, error and success messages take the text tier

`.strand-form-field__required` is blue-primary, not red: it says "required", which is information, and red is reserved for `__error`. Error copy at `--strand-text-xs` uses red-alert-deep and success uses green-positive-deep, because the fill-tier accents read below 4.5:1 at that size on a light surface; the fill tier stays on panels and glyphs. Success is a third field message state, wired into the same describedby chain as hint and error, so an availability check or a strength meter is one line about the input rather than a competing element outside it.

Where: `packages/strand-ui/src/components/FormField/FormField.css`; `docs/cf/formfield-describedby.md`
