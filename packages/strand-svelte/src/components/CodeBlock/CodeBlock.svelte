<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<script lang="ts">
  /** The code content to display */
  export let code: string
  /** Optional language label (e.g. "html", "css", "bash") */
  export let language: string | undefined = undefined
</script>

<div class="strand-code-block" {...$$restProps}>
  {#if language}
    <span class="strand-code-block__label">{language}</span>
  {/if}
  <pre class="strand-code-block__pre"><code>{code}</code></pre>
</div>
