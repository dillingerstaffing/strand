<!--! Strand Vue | MIT License | dillingerstaffing.com -->
<!--
  Data table with column definitions, sortable headers, and row rendering.

  @example
  ```vue
  <script setup>
  import { Table } from '@dillingerstaffing/strand-vue';

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role' },
  ];
  const data = [
    { name: 'Jane', role: 'Engineer' },
    { name: 'Alex', role: 'Designer' },
  ];
  </script>

  <template>
    <Table :columns="columns" :data="data" @sort="(key, dir) => console.log(key, dir)" />
  </template>
  ```
-->
<script setup lang="ts">
import { type VNodeChild, computed, ref } from 'vue'

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
  /** Renders the cell from the whole row; the field value renders by default. */
  render?: (row: TableRow, index: number) => VNodeChild
}

export interface TableProps {
  /** Column definitions */
  columns: TableColumn[]
  /** Row data */
  data: TableRow[]
  /** Field whose value keys each row, or a function of the row; the row index by default. */
  rowKey?: string | ((row: TableRow, index: number) => string | number)
  /** The table's accessible name, rendered as a visually hidden caption. */
  label?: string
  /** A visible caption. */
  caption?: string
  /** Text of the single cell shown when there are no rows. */
  emptyLabel?: string
  /** Controlled sort; leave unset to let the table own it. */
  sort?: TableSort | null
}

const props = withDefaults(defineProps<TableProps>(), {
  rowKey: undefined,
  label: undefined,
  caption: undefined,
  emptyLabel: 'No rows',
  sort: undefined,
})

const emit = defineEmits<{
  (e: 'sort', key: string, direction: 'asc' | 'desc'): void
  (e: 'update:sort', sort: TableSort): void
}>()

const ownSort = ref<TableSort | null>(null)
const current = computed(() => (props.sort === undefined ? ownSort.value : props.sort))

function handleSort(key: string) {
  const direction = current.value?.key === key && current.value.direction === 'asc' ? 'desc' : 'asc'
  if (props.sort === undefined) ownSort.value = { key, direction }
  emit('sort', key, direction)
  emit('update:sort', { key, direction })
}
function sortedAs(key: string): 'asc' | 'desc' | null {
  return current.value?.key === key ? current.value.direction : null
}
function ariaSort(col: TableColumn): 'ascending' | 'descending' | 'none' | undefined {
  if (!col.sortable) return undefined
  const s = sortedAs(col.key)
  return s === 'asc' ? 'ascending' : s === 'desc' ? 'descending' : 'none'
}
function sortIndicator(key: string): string {
  const s = sortedAs(key)
  return s === 'asc' ? '\u2191' : s === 'desc' ? '\u2193' : '\u2195'
}
function keyOf(row: TableRow, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  if (props.rowKey) return String(row[props.rowKey])
  return index
}
const Cell = (p: { col: TableColumn; row: TableRow; index: number }) => (p.col.render ? p.col.render(p.row, p.index) : (p.row[p.col.key] as VNodeChild))
</script>

<template>
  <div class="strand-table-wrapper">
    <table class="strand-table">
      <caption v-if="caption || label" :class="['strand-table__caption', !caption && 'strand-sr-only'].filter(Boolean).join(' ')">
        {{ caption ?? label }}
      </caption>
      <thead class="strand-table__head">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            class="strand-table__th"
            :style="col.width ? { width: col.width } : undefined"
            :aria-sort="ariaSort(col)"
          >
            <button v-if="col.sortable" type="button" class="strand-table__sort-btn" :aria-label="`Sort by ${col.header}`" @click="handleSort(col.key)">
              {{ col.header }}
              <span class="strand-table__sort-indicator" aria-hidden="true">{{ sortIndicator(col.key) }}</span>
            </button>
            <template v-else>{{ col.header }}</template>
          </th>
        </tr>
      </thead>
      <tbody class="strand-table__body">
        <tr v-if="data.length === 0" class="strand-table__row strand-table__row--empty">
          <td class="strand-table__td" :colspan="columns.length">{{ emptyLabel }}</td>
        </tr>
        <tr v-for="(row, rowIndex) in data" v-else :key="keyOf(row, rowIndex)" class="strand-table__row">
          <td v-for="col in columns" :key="col.key" class="strand-table__td">
            <Cell :col="col" :row="row" :index="rowIndex" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
