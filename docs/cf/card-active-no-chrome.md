# An active card paints no chrome of its own

`.strand-card--active` (and `.strand-result-card--active`) is a semantic hook that paints nothing. Every chrome treatment tried for the alive signal was wrong: a radar sweep read as animation, a halo plus top accent read as workspace chrome, a left-edge accent bar is the lowest-effort default of every generated UI and is banned, and a tinted background read as blue borders across a grid. The signal is carried entirely by inline affordances inside the card (a joined pill, a live status chip, a lifecycle overline, a status indicator). Selection in a master-detail list uses a background tint only. Do not add a border, bar or glow to an active card.

Where: `packages/strand-ui/src/components/Card/Card.css`, `packages/strand-ui/src/components/ResultCard/ResultCard.css`
