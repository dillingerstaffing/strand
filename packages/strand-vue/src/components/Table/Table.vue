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
import { computed, ref } from 'vue'

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

export interface TableProps {
  /** Column definitions */
  columns: TableColumn[]
  /** Row data */
  data: Array<Record<string, unknown>>
}

const props = defineProps<TableProps>()

const emit = defineEmits<{
  (e: 'sort', key: string, direction: 'asc' | 'desc'): void
}>()

const sortKey = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const wrapperClasses = computed(() =>
  ['strand-table-wrapper'].filter(Boolean).join(' '),
)

function handleSort(key: string) {
  const nextDirection =
    sortKey.value === key && sortDirection.value === 'asc' ? 'desc' : 'asc'
  sortKey.value = key
  sortDirection.value = nextDirection
  emit('sort', key, nextDirection)
}

function sortIndicator(key: string): string {
  if (sortKey.value === key) {
    return sortDirection.value === 'asc' ? '\u2191' : '\u2193'
  }
  return '\u2195'
}
</script>

<template>
  <div :class="wrapperClasses">
    <table class="strand-table">
      <thead class="strand-table__head">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="strand-table__th"
            :style="col.width ? { width: col.width } : undefined"
          >
            <button
              v-if="col.sortable"
              type="button"
              class="strand-table__sort-btn"
              :aria-label="`Sort by ${col.header}`"
              @click="handleSort(col.key)"
            >
              {{ col.header }}
              <span class="strand-table__sort-indicator" aria-hidden="true">
                {{ sortIndicator(col.key) }}
              </span>
            </button>
            <template v-else>
              {{ col.header }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody class="strand-table__body">
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="strand-table__row"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="strand-table__td"
          >
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
