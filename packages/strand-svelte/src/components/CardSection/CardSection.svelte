<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  A horizontal row inside a composed card, separated from siblings
  by a hairline rule. Use multiple CardSection children inside a
  Card with padding="none" to stack header / body / cta rows. The
  first child's top rule is suppressed automatically.
-->
<script lang="ts">
  /** When true, applies the --header layout (baseline, space-between, gap) */
  export let header: boolean = false

  $: classes = [
    'strand-card__section',
    header ? 'strand-card__section--header' : '',
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>
