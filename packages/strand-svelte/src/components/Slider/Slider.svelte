<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** Minimum value */
  export let min: number = 0
  /** Maximum value */
  export let max: number = 100
  /** Step increment */
  export let step: number = 1
  /** Current value */
  export let value: number | undefined = undefined
  /** Disabled state */
  export let disabled: boolean = false
  /** Change handler */
  export let onchange: ((e: Event) => void) | undefined = undefined

  $: wrapperClasses = [
    'strand-slider',
    disabled && 'strand-slider--disabled',
  ].filter(Boolean).join(' ')
</script>

<div class={wrapperClasses}>
  <input
    type="range"
    class="strand-slider__field"
    {min}
    {max}
    {step}
    {value}
    {disabled}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    on:change={onchange}
    {...$$restProps}
  />
</div>
