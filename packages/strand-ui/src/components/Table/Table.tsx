/*! Strand UI | MIT License | dillingerstaffing.com */

import type { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useState } from "preact/hooks";
import { cx } from "../../internal/index.js";

export type TableRow = Record<string, unknown>;
export type TableSort = { key: string; direction: "asc" | "desc" };

export interface TableColumn {
  /** Field key in each row. */
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  /** Renders the cell from the whole row; the field value renders by default. */
  render?: (row: TableRow, index: number) => ComponentChildren;
}

export interface TableProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "data"> {
  columns: TableColumn[];
  data: TableRow[];
  /** Field whose value keys each row, or a function of the row; the row index by default. */
  rowKey?: string | ((row: TableRow, index: number) => string | number);
  /** The table's accessible name, rendered as a visually hidden caption. */
  label?: string;
  /** A visible caption. */
  caption?: ComponentChildren;
  /** Text of the single cell shown when there are no rows. */
  emptyLabel?: string;
  /** Controlled sort; leave unset to let the table own it. */
  sort?: TableSort | null;
  /** Called with the column key and the direction after a sortable header is pressed. */
  onSort?: (key: string, direction: "asc" | "desc") => void;
}

/**
 * Data table with sortable headers.
 *
 * @example
 * <Table columns={[{ key: "name", header: "Name", sortable: true }]} data={rows} onSort={sortBy} />
 */
export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ columns, data, rowKey, label, caption, emptyLabel = "No rows", sort, onSort, className = "", ...rest }, ref) => {
    const [ownSort, setOwnSort] = useState<TableSort | null>(null);
    const current = sort === undefined ? ownSort : sort;
    const handleSort = (key: string) => {
      const direction = current?.key === key && current.direction === "asc" ? "desc" : "asc";
      if (sort === undefined) setOwnSort({ key, direction });
      onSort?.(key, direction);
    };
    const keyOf = (row: TableRow, index: number) => (typeof rowKey === "function" ? rowKey(row, index) : rowKey ? String(row[rowKey]) : index);
    return (
      <div ref={ref} className={cx("strand-table-wrapper", className)} {...rest}>
        <table className="strand-table">
          {(caption || label) && <caption className={cx("strand-table__caption", !caption && "strand-sr-only")}>{caption ?? label}</caption>}
          <thead className="strand-table__head">
            <tr>
              {columns.map((col) => {
                const sorted = current?.key === col.key ? current.direction : null;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className="strand-table__th"
                    style={col.width ? { width: col.width } : undefined}
                    aria-sort={col.sortable ? (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none") : undefined}
                  >
                    {col.sortable ? (
                      <button type="button" className="strand-table__sort-btn" onClick={() => handleSort(col.key)} aria-label={`Sort by ${col.header}`}>
                        {col.header}
                        <span className="strand-table__sort-indicator" aria-hidden="true">
                          {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
                        </span>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="strand-table__body">
            {data.length === 0 ? (
              <tr className="strand-table__row strand-table__row--empty">
                <td className="strand-table__td" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={keyOf(row, rowIndex)} className="strand-table__row">
                  {columns.map((col) => (
                    <td key={col.key} className="strand-table__td">
                      {col.render ? col.render(row, rowIndex) : (row[col.key] as ComponentChildren)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);
Table.displayName = "Table";
