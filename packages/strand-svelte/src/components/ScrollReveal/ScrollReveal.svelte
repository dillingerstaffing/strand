<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Intersection Observer wrapper that reveals children with a transition on scroll.

  @example
  ```svelte
  <script>
    import { ScrollReveal } from '@dillingerstaffing/strand-svelte';
  </script>

  <ScrollReveal threshold={0.2} once>
    <p>This content fades in on scroll.</p>
  </ScrollReveal>
  ```
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  /** Intersection threshold (0-1) to trigger reveal */
  export let threshold: number = 0.1
  /** Only reveal once (do not hide on exit) */
  export let once: boolean = true

  let elRef: HTMLDivElement
  let visible = false
  let observer: IntersectionObserver | null = null

  $: classes = [
    'strand-reveal',
    visible && 'strand-reveal--visible',
  ].filter(Boolean).join(' ')

  onMount(() => {
    if (!elRef) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible = true
            if (once && observer && elRef) {
              observer.unobserve(elRef)
            }
          } else if (!once) {
            visible = false
          }
        }
      },
      { threshold },
    )

    observer.observe(elRef)
  })

  onDestroy(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })
</script>

<div bind:this={elRef} class={classes} {...$$restProps}>
  <slot />
</div>
