<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Label column content (mono, uppercase, left) */
  export let label: string
  /** Value column content (sans, blue-midnight, right) */
  export let value: string
  /** When true, applies --status color (teal-vital) to the value */
  export let status: boolean = false

  $: classes = ['strand-kv', 'strand-kv--editorial'].join(' ')
  $: valueClasses = [
    'strand-kv__value',
    status ? 'strand-kv__value--status' : '',
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {...$$restProps}>
  <span class="strand-kv__label">{label}</span>
  <span class={valueClasses}>{value}</span>
</div>
