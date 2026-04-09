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
<script lang="ts">
  export interface TableColumn {
    /** Unique key matching the data field */
    key: string
    /** Display header text */
    header: string
    /** Whether the column is sortable */
    sortable?: boolean
    /** Optional fixed width */
    width?: string
  }

  /** Column definitions */
  export let columns: TableColumn[] = []
  /** Row data */
  export let data: Array<Record<string, any>> = []
  /** Called when a sortable column header is clicked */
  export let onsort: ((key: string, direction: 'asc' | 'desc') => void) | undefined = undefined

  let sortKey: string | null = null
  let sortDirection: 'asc' | 'desc' = 'asc'

  function handleSort(key: string) {
    const nextDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    sortKey = key
    sortDirection = nextDirection
    onsort?.(key, nextDirection)
  }
</script>

<div class="strand-table-wrapper" {...$$restProps}>
  <table class="strand-table">
    <thead class="strand-table__head">
      <tr>
        {#each columns as col (col.key)}
          <th class="strand-table__th" style={col.width ? `width: ${col.width}` : undefined}>
            {#if col.sortable}
              <button
                type="button"
                class="strand-table__sort-btn"
                aria-label={`Sort by ${col.header}`}
                on:click={() => handleSort(col.key)}
              >
                {col.header}
                <span class="strand-table__sort-indicator" aria-hidden="true">
                  {sortKey === col.key ? (sortDirection === 'asc' ? '\u2191' : '\u2193') : '\u2195'}
                </span>
              </button>
            {:else}
              {col.header}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="strand-table__body">
      {#each data as row, rowIndex (rowIndex)}
        <tr class="strand-table__row">
          {#each columns as col (col.key)}
            <td class="strand-table__td">{row[col.key]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
