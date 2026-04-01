import { describe, it, expect } from "vitest";
import { components, VALID_CATEGORIES, type ComponentCategory } from "../registry.js";

const EXPECTED_COMPONENTS = [
  "button",
  "input",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "switch",
  "slider",
  "formfield",
  "card",
  "badge",
  "avatar",
  "tag",
  "table",
  "datareadout",
  "stack",
  "grid",
  "container",
  "divider",
  "section",
  "link",
  "tabs",
  "breadcrumb",
  "nav",
  "toast",
  "alert",
  "dialog",
  "tooltip",
  "progress",
  "spinner",
  "skeleton",
];

describe("registry", () => {
  it("contains all 31 components", () => {
    expect(components.size).toBe(31);
  });

  it("has an entry for every expected component", () => {
    for (const name of EXPECTED_COMPONENTS) {
      expect(components.has(name)).toBe(true);
    }
  });

  it("each component has name, category, and files", () => {
    for (const [key, entry] of components) {
      expect(entry.name).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(Array.isArray(entry.files)).toBe(true);
      expect(entry.files.length).toBeGreaterThan(0);
    }
  });

  it("all categories are valid", () => {
    for (const [, entry] of components) {
      expect(VALID_CATEGORIES).toContain(entry.category);
    }
  });

  it("has no duplicate component names", () => {
    const names = Array.from(components.values()).map((e) => e.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it("files arrays are non-empty and contain expected file types", () => {
    for (const [, entry] of components) {
      expect(entry.files.length).toBeGreaterThanOrEqual(2);
      const hasTs = entry.files.some(
        (f) => f.endsWith(".ts") || f.endsWith(".tsx")
      );
      expect(hasTs).toBe(true);
    }
  });

  it("VALID_CATEGORIES contains exactly 5 categories", () => {
    expect(VALID_CATEGORIES).toEqual([
      "Input",
      "Display",
      "Layout",
      "Navigation",
      "Feedback",
    ]);
  });

  it("every category has at least one component", () => {
    for (const category of VALID_CATEGORIES) {
      const inCategory = Array.from(components.values()).filter(
        (e) => e.category === category
      );
      expect(inCategory.length).toBeGreaterThan(0);
    }
  });
});
