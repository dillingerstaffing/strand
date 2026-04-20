<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  export let padNone: boolean = false
  export let recessed: boolean = false

  $: classes = [
    'strand-ref-example__demo',
    padNone ? 'strand-ref-example__demo--pad-none' : '',
    recessed ? 'strand-ref-example__demo--recessed' : '',
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>
