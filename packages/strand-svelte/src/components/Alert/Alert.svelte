<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Visual status of the alert */
  export let status: 'info' | 'success' | 'warning' | 'error' = 'info'
  /** Show dismiss button */
  export let dismissible: boolean = false
  /** Called when dismiss button is clicked */
  export let ondismiss: (() => void) | undefined = undefined

  $: role = status === 'error' || status === 'warning' ? 'alert' : 'status'

  $: classes = [
    'strand-alert',
    `strand-alert--${status}`,
  ].filter(Boolean).join(' ')
</script>

<div class={classes} {role} {...$$restProps}>
  <div class="strand-alert__content">
    <slot />
  </div>
  {#if dismissible}
    <button
      type="button"
      class="strand-alert__dismiss"
      aria-label="Dismiss"
      on:click={() => ondismiss?.()}
    >
      &#215;
    </button>
  {/if}
</div>
