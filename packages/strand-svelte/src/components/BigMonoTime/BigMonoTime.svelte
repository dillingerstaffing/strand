<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!-- An oversized monospace clock readout. tabular-nums is why 06:45 and
     11:11 are the same width and a column of times does not ripple. -->
<script lang="ts">
  export let value: string
  export let until: string | undefined = undefined
  export let separator: string = '–'
  export let size: 'sm' | 'md' | 'lg' = 'md'
  /** Machine-readable value; supplied means it renders as <time>. */
  export let dateTime: string | undefined = undefined
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-big-mono-time', size !== 'md' ? `strand-big-mono-time--${size}` : '', className]
    .filter(Boolean).join(' ')
</script>

<svelte:element this={dateTime ? 'time' : 'span'} class={classes} datetime={dateTime} {...$$restProps}>
  {value}{#if until}<span class="strand-big-mono-time__sep" aria-hidden="true">{separator}</span>{until}{/if}
</svelte:element>
