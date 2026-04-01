import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import { Table } from "./Table.js";

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role" },
  { key: "status", header: "Status", sortable: true },
];

const data = [
  { name: "Alice", role: "Engineer", status: "Active" },
  { name: "Bob", role: "Designer", status: "Away" },
];

describe("Table", () => {
  // ── Rendering ──

  it("renders a table element", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    expect(container.querySelector("table")).toBeTruthy();
  });

  it("renders column headers", () => {
    const { getByText } = render(<Table columns={columns} data={data} />);
    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Role")).toBeTruthy();
    expect(getByText("Status")).toBeTruthy();
  });

  it("renders data rows", () => {
    const { getByText } = render(<Table columns={columns} data={data} />);
    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
  });

  it("renders correct number of cells", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const cells = container.querySelectorAll(".strand-table__td");
    // 2 rows x 3 columns = 6 cells
    expect(cells.length).toBe(6);
  });

  it("renders correct number of header cells", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const headers = container.querySelectorAll(".strand-table__th");
    expect(headers.length).toBe(3);
  });

  // ── Sorting ──

  it("renders sort button for sortable columns", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    // "Name" and "Status" are sortable
    expect(sortButtons.length).toBe(2);
  });

  it("does not render sort button for non-sortable columns", () => {
    const nonSortable = [{ key: "role", header: "Role" }];
    const { container } = render(
      <Table columns={nonSortable} data={data} />,
    );
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    expect(sortButtons.length).toBe(0);
  });

  it("calls onSort with key and asc direction on first click", () => {
    const onSort = vi.fn();
    const { container } = render(
      <Table columns={columns} data={data} onSort={onSort} />,
    );
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    fireEvent.click(sortButtons[0]);
    expect(onSort).toHaveBeenCalledWith("name", "asc");
  });

  it("toggles sort direction on second click of same column", () => {
    const onSort = vi.fn();
    const { container } = render(
      <Table columns={columns} data={data} onSort={onSort} />,
    );
    const sortButtons = container.querySelectorAll(".strand-table__sort-btn");
    fireEvent.click(sortButtons[0]); // asc
    fireEvent.click(sortButtons[0]); // desc
    expect(onSort).toHaveBeenLastCalledWith("name", "desc");
  });

  // ── Responsive ──

  it("wraps table in overflow-x scroll container", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const wrapper = container.querySelector(".strand-table-wrapper");
    expect(wrapper).toBeTruthy();
  });

  // ── Custom className ──

  it("merges custom className with wrapper classes", () => {
    const { container } = render(
      <Table columns={columns} data={data} className="custom" />,
    );
    const wrapper = container.querySelector(".strand-table-wrapper");
    expect(wrapper?.className).toContain("strand-table-wrapper");
    expect(wrapper?.className).toContain("custom");
  });

  // ── Empty state ──

  it("renders empty tbody when data is empty", () => {
    const { container } = render(<Table columns={columns} data={[]} />);
    const rows = container.querySelectorAll(".strand-table__row");
    expect(rows.length).toBe(0);
  });

  // ── Column width ──

  it("applies width style to column headers", () => {
    const cols = [{ key: "name", header: "Name", width: "200px" }];
    const { container } = render(<Table columns={cols} data={[]} />);
    const th = container.querySelector(".strand-table__th") as HTMLElement;
    expect(th?.style.width).toBe("200px");
  });

  // ── Sort indicator ──

  it("shows sort indicator on sortable columns", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const indicators = container.querySelectorAll(
      ".strand-table__sort-indicator",
    );
    expect(indicators.length).toBe(2);
  });
});
