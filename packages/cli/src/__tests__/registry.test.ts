import { describe, it, expect } from "vitest";
import { components, VALID_CATEGORIES } from "../registry.js";

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
  "codeblock",
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
  it("contains all 32 components", () => {
    expect(components.size).toBe(32);
  });

  it("has an entry for every expected component", () => {
    for (const name of EXPECTED_COMPONENTS) {
      expect(components.has(name)).toBe(true);
    }
  });

  it("each component has name, category, and framework-keyed files", () => {
    for (const [, entry] of components) {
      expect(entry.name).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(typeof entry.files).toBe("object");
      expect(entry.files.preact.length).toBeGreaterThan(0);
      expect(entry.files.vue.length).toBeGreaterThan(0);
      expect(entry.files.svelte.length).toBeGreaterThan(0);
      expect(entry.files["css-only"].length).toBeGreaterThan(0);
    }
  });

  it("preact files include .tsx and .css", () => {
    for (const [, entry] of components) {
      const hasTsx = entry.files.preact.some((f) => f.endsWith(".tsx"));
      const hasCss = entry.files.preact.some((f) => f.endsWith(".css"));
      expect(hasTsx).toBe(true);
      expect(hasCss).toBe(true);
    }
  });

  it("vue files include .vue and .css", () => {
    for (const [, entry] of components) {
      const hasVue = entry.files.vue.some((f) => f.endsWith(".vue"));
      const hasCss = entry.files.vue.some((f) => f.endsWith(".css"));
      expect(hasVue).toBe(true);
      expect(hasCss).toBe(true);
    }
  });

  it("svelte files include .svelte and .css", () => {
    for (const [, entry] of components) {
      const hasSvelte = entry.files.svelte.some((f) => f.endsWith(".svelte"));
      const hasCss = entry.files.svelte.some((f) => f.endsWith(".css"));
      expect(hasSvelte).toBe(true);
      expect(hasCss).toBe(true);
    }
  });

  it("css-only files include only .css", () => {
    for (const [, entry] of components) {
      expect(entry.files["css-only"].length).toBe(1);
      expect(entry.files["css-only"][0]).toMatch(/\.css$/);
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
