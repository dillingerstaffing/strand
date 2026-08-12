<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!-- An initials avatar beside a name, in a pill. The circle is aria-hidden:
     the name is the accessible name, and announcing "MK, Maria Klein"
     reads the same person twice. -->
<script lang="ts" context="module">
  /** First letters of the first and last words, up to two. */
  export function initialsFrom(name: string): string {
    const p = name.trim().split(/\s+/).filter(Boolean)
    if (!p.length) return ''
    return ((p[0][0] ?? '') + (p.length > 1 ? (p[p.length - 1][0] ?? '') : '')).toUpperCase()
  }
</script>
<script lang="ts">
  export let name: string
  export let initials: string | undefined = undefined
  /** Makes the chip a button. */
  export let selectable: boolean = false
  export let onselect: (() => void) | undefined = undefined
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-person-chip', selectable ? 'strand-person-chip--action' : '', className]
    .filter(Boolean).join(' ')
</script>

{#if selectable}
  <button type="button" class={classes} on:click={() => onselect?.()} {...$$restProps}>
    <span class="strand-person-chip__avatar" aria-hidden="true">{initials ?? initialsFrom(name)}</span>
    <span class="strand-person-chip__name">{name}</span>
  </button>
{:else}
  <span class={classes} {...$$restProps}>
    <span class="strand-person-chip__avatar" aria-hidden="true">{initials ?? initialsFrom(name)}</span>
    <span class="strand-person-chip__name">{name}</span>
  </span>
{/if}
