<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  A region that holds its box while data loads, then cross-fades the
  placeholder to the content.

  Implements design-language.md 6.6.1 (the space contract) and 6.6.2
  (placeholder to content). Thin wrapper over the `.strand-reserve` classes.

  Sizing: if the placeholder already matches the shape of the content, the
  region sizes itself and you need no height at all. Supply `height` only
  when the placeholder is genuinely smaller than what replaces it.

  @example
  ```svelte
  <script>
    import { Reserve, Skeleton } from '@dillingerstaffing/strand-svelte';
  </script>

  <Reserve ready={!!event}>
    <svelte:fragment slot="placeholder">
      <Skeleton variant="rectangle" height="42px" />
    </svelte:fragment>
    <JoinLive {event} />
  </Reserve>
  ```
-->
<script lang="ts">
  /** Whether the real content has arrived. Drives the cross-fade. */
  export let ready: boolean = false
  /** Reserved minimum height, base breakpoint. Any CSS length. */
  export let height: string | undefined = undefined
  /** Reserved minimum height from 768px up. Falls back to `height`. */
  export let heightMd: string | undefined = undefined
  /** Reserved minimum height from 1024px up. Falls back to `heightMd`. */
  export let heightLg: string | undefined = undefined

  $: inlineStyle = [
    height ? `--strand-reserve-h: ${height}` : '',
    heightMd ? `--strand-reserve-h-md: ${heightMd}` : '',
    heightLg ? `--strand-reserve-h-lg: ${heightLg}` : '',
  ].filter(Boolean).join('; ')
</script>

<div
  class="strand-reserve"
  data-strand-reserve={ready ? 'ready' : 'pending'}
  style={inlineStyle || undefined}
  {...$$restProps}
>
  <div class="strand-reserve__placeholder" aria-hidden="true">
    <slot name="placeholder" />
  </div>
  <div class="strand-reserve__content">
    <slot />
  </div>
</div>
