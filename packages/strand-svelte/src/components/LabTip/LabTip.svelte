<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let pinned: boolean = false
  $: classes = ['strand-ref-tip', pinned ? 'strand-ref-tip--pinned' : '']
    .filter(Boolean)
    .join(' ')
</script>

<span class={classes} {...$$restProps}>
  <slot />
</span>
