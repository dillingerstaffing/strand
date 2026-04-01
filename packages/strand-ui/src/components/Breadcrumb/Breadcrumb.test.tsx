import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Breadcrumb } from "./Breadcrumb.js";

const sampleItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Widget" },
];

describe("Breadcrumb", () => {
  // ── Structure ──

  it("renders nav with aria-label Breadcrumb", () => {
    const { getByRole } = render(<Breadcrumb items={sampleItems} />);
    const nav = getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("renders an ol element", () => {
    const { container } = render(<Breadcrumb items={sampleItems} />);
    expect(container.querySelector("ol")).toBeTruthy();
  });

  it("renders all items", () => {
    const { getAllByRole } = render(<Breadcrumb items={sampleItems} />);
    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  // ── Current page ──

  it("last item has aria-current page", () => {
    const { getByText } = render(<Breadcrumb items={sampleItems} />);
    expect(getByText("Widget")).toHaveAttribute("aria-current", "page");
  });

  it("last item is not a link", () => {
    const { getByText } = render(<Breadcrumb items={sampleItems} />);
    expect(getByText("Widget").tagName).toBe("SPAN");
  });

  // ── Links ──

  it("non-last items are rendered as links", () => {
    const { getByText } = render(<Breadcrumb items={sampleItems} />);
    expect(getByText("Home").tagName).toBe("A");
    expect(getByText("Products").tagName).toBe("A");
  });

  it("link items have correct href", () => {
    const { getByText } = render(<Breadcrumb items={sampleItems} />);
    expect(getByText("Home")).toHaveAttribute("href", "/");
    expect(getByText("Products")).toHaveAttribute("href", "/products");
  });

  // ── Separator ──

  it("renders default separator between items", () => {
    const { container } = render(<Breadcrumb items={sampleItems} />);
    const separators = container.querySelectorAll(
      ".strand-breadcrumb__separator",
    );
    expect(separators).toHaveLength(2);
    expect(separators[0].textContent).toBe("/");
  });

  it("renders custom separator", () => {
    const { container } = render(
      <Breadcrumb items={sampleItems} separator=">" />,
    );
    const separators = container.querySelectorAll(
      ".strand-breadcrumb__separator",
    );
    expect(separators[0].textContent).toBe(">");
  });

  // ── Custom className ──

  it("merges custom className", () => {
    const { getByRole } = render(
      <Breadcrumb items={sampleItems} className="custom" />,
    );
    const nav = getByRole("navigation");
    expect(nav.className).toContain("strand-breadcrumb");
    expect(nav.className).toContain("custom");
  });

  // ── Edge cases ──

  it("single item renders correctly as current page", () => {
    const { getByText, getAllByRole } = render(
      <Breadcrumb items={[{ label: "Home" }]} />,
    );
    expect(getAllByRole("listitem")).toHaveLength(1);
    expect(getByText("Home")).toHaveAttribute("aria-current", "page");
  });

  it("separators have aria-hidden true", () => {
    const { container } = render(<Breadcrumb items={sampleItems} />);
    const separators = container.querySelectorAll(
      ".strand-breadcrumb__separator",
    );
    for (const sep of separators) {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    }
  });
});
