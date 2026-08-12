<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  One result in an instrument's results panel. Renders as a <button> when
  selectable and an <article> when not: a card that pans a map when
  clicked is a control and owes the keyboard the same affordance as the
  mouse. `active` pairs with aria-current so the highlighted result is
  announced rather than only tinted.
-->
<script lang="ts">
  interface Badge { label: string; variant?: 'remote' | 'source' }
  export let title: string
  export let company: string | undefined = undefined
  export let location: string | undefined = undefined
  export let salary: string | undefined = undefined
  export let badges: Badge[] | undefined = undefined
  export let active: boolean = false
  /** Makes the card a button. */
  export let selectable: boolean = false
  export let onselect: (() => void) | undefined = undefined
  /** Merged explicitly; $$restProps spreads after class and would replace it. */
  let className: string = ''
  export { className as class }
  $: classes = ['strand-result-card', active ? 'strand-result-card--active' : '', className]
    .filter(Boolean).join(' ')
  const badgeClass = (b: Badge) =>
    ['strand-result-card__badge', b.variant ? `strand-result-card__badge--${b.variant}` : '']
      .filter(Boolean).join(' ')
</script>

{#if selectable}
  <button type="button" class={classes} aria-current={active ? 'true' : undefined} on:click={() => onselect?.()} {...$$restProps}>
    <div class="strand-result-card__title">{title}</div>
    {#if company}<div class="strand-result-card__company">{company}</div>{/if}
    {#if location || salary || badges?.length}
      <div class="strand-result-card__meta">
        {#if location}<span class="strand-result-card__location">{location}</span>{/if}
        {#if salary}<span class="strand-result-card__salary">{salary}</span>{/if}
        {#each badges ?? [] as b (b.label)}<span class={badgeClass(b)}>{b.label}</span>{/each}
      </div>
    {/if}
  </button>
{:else}
  <article class={classes} aria-current={active ? 'true' : undefined} {...$$restProps}>
    <div class="strand-result-card__title">{title}</div>
    {#if company}<div class="strand-result-card__company">{company}</div>{/if}
    {#if location || salary || badges?.length}
      <div class="strand-result-card__meta">
        {#if location}<span class="strand-result-card__location">{location}</span>{/if}
        {#if salary}<span class="strand-result-card__salary">{salary}</span>{/if}
        {#each badges ?? [] as b (b.label)}<span class={badgeClass(b)}>{b.label}</span>{/each}
      </div>
    {/if}
  </article>
{/if}
