# The feature surface is emphasis, not density, and its token block is the primitive

`.strand-feature-surface` is midnight and exists to lift one element out of a list; `.strand-instrument-viewport` is the abyss and exists for density (maps, charts, terminal output). Midnight is about 2.5 times lighter than the abyss, so the viewport's text values do not survive the move: gray-400 falls from 6.99:1 to 4.36:1 and teal-vital from 7.07:1 to 4.42:1, both below AA as text. Every token value the surface sets is therefore one rung lighter than the viewport's, and a bare `background: midnight` would hand a consumer the right box with the wrong contents. Its padding ladder is Card's; clipping travels with `--pad-none`, not the base, because a base clip would change overflow for every consumer that never asked.

Where: `packages/strand-ui/src/components/FeatureSurface/FeatureSurface.css`; `docs/cf/surface-tokens.md`
