# A value tone wins wherever it is composed, so its colour is `!important`

`.strand-value--positive` and `--negative` colour a figure by its financial sign and are composed onto any text node: a table cell, a readout value, a kv value. Component rules such as `.strand-kv--editorial .strand-kv__value` set colour at higher specificity and later source order, so without `!important` the composed tone silently loses the cascade. The colour reads its surface token (`--strand-value-positive-color`, `-negative-`) so dark surfaces can restate it, and the deep rungs are the light default because the pure accents do not read as small figures.

Where: `packages/strand-ui/src/typography.css`
