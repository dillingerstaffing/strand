<!--! Strand Svelte | MIT License | dillingerstaffing.com -->
<!--
  Data table with column definitions, sortable headers, and row rendering.

  @example
  ```svelte
  <script>
    import { Table } from '@dillingerstaffing/strand-svelte';

    const columns = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'role', header: 'Role' },
    ];
    const data = [
      { name: 'Jane', role: 'Engineer' },
      { name: 'Alex', role: 'Designer' },
    ];
  </script>

  <Table {columns} {data} onsort={(key, dir) => console.log(key, dir)} />
  ```
-->
<script lang="ts" context="module">
  export type TableRow = Record<string, unknown>
  export type TableSort = { key: string; direction: 'asc' | 'desc' }

  export interface TableColumn {
    /** Unique key matching the data field */
    key: string
    /** Display header text */
    header: string
    /** Whether the column is sortable */
    sortable?: boolean
    /** Optional fixed width */
    width?: string
    /** Renders the cell's text from the whole row; the field value renders by default. */
    render?: (row: TableRow, index: number) => string | number
  }
</script>

<script lang="ts">
  /** Column definitions */
  export let columns: TableColumn[] = []
  /** Row data */
  export let data: TableRow[] = []
  /** Field whose value keys each row, or a function of the row; the row index by default. */
  export let rowKey: string | ((row: TableRow, index: number) => string | number) | undefined = undefined
  /** The table's accessible name, rendered as a visually hidden caption. */
  export let label: string | undefined = undefined
  /** A visible caption. */
  export let caption: string | undefined = undefined
  /** Text of the single cell shown when there are no rows. */
  export let emptyLabel: string = 'No rows'
  /** Controlled sort; leave undefined to let the table own it. */
  export let sort: TableSort | null | undefined = undefined
  /** Called when a sortable column header is clicked */
  export let onsort: ((key: string, direction: 'asc' | 'desc') => void) | undefined = undefined

  let ownSort: TableSort | null = null
  $: current = sort === undefined ? ownSort : sort

  function handleSort(key: string) {
    const direction = current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    if (sort === undefined) ownSort = { key, direction }
    onsort?.(key, direction)
  }
  function ariaSort(col: TableColumn, cur: TableSort | null): 'ascending' | 'descending' | 'none' | undefined {
    if (!col.sortable) return undefined
    if (cur?.key !== col.key) return 'none'
    return cur.direction === 'asc' ? 'ascending' : 'descending'
  }
  function indicator(col: TableColumn, cur: TableSort | null): string {
    if (cur?.key !== col.key) return '\u2195'
    return cur.direction === 'asc' ? '\u2191' : '\u2193'
  }
  function keyOf(row: TableRow, index: number): string | number {
    if (typeof rowKey === 'function') return rowKey(row, index)
    if (rowKey) return String(row[rowKey])
    return index
  }
</script>

<div class="strand-table-wrapper" {...$$restProps}>
  <table class="strand-table">
    {#if caption || label}
      <caption class={['strand-table__caption', !caption && 'strand-sr-only'].filter(Boolean).join(' ')}>{caption ?? label}</caption>
    {/if}
    <thead class="strand-table__head">
      <tr>
        {#each columns as col (col.key)}
          <th scope="col" class="strand-table__th" style={col.width ? `width: ${col.width}` : undefined} aria-sort={ariaSort(col, current)}>
            {#if col.sortable}
              <button type="button" class="strand-table__sort-btn" aria-label={`Sort by ${col.header}`} on:click={() => handleSort(col.key)}>
                {col.header}<span class="strand-table__sort-indicator" aria-hidden="true">{indicator(col, current)}</span>
              </button>
            {:else}
              {col.header}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="strand-table__body">
      {#if data.length === 0}
        <tr class="strand-table__row strand-table__row--empty">
          <td class="strand-table__td" colspan={columns.length}>{emptyLabel}</td>
        </tr>
      {:else}
        {#each data as row, rowIndex (keyOf(row, rowIndex))}
          <tr class="strand-table__row">
            {#each columns as col (col.key)}
              <td class="strand-table__td">{col.render ? col.render(row, rowIndex) : row[col.key]}</td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
