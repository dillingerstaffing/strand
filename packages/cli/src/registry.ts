import type { Framework } from "./commands/init.js";

export type ComponentCategory =
  | "Input"
  | "Display"
  | "Layout"
  | "Navigation"
  | "Feedback";

export interface ComponentEntry {
  name: string;
  category: ComponentCategory;
  files: Record<Framework, string[]>;
}

function entry(
  name: string,
  category: ComponentCategory,
): ComponentEntry {
  return {
    name,
    category,
    files: {
      preact: [`${name}.tsx`, `${name}.css`, "index.ts"],
      vue: [`${name}.vue`, `${name}.css`, "index.ts"],
      "css-only": [`${name}.css`],
    },
  };
}

export const components: Map<string, ComponentEntry> = new Map([
  // Input
  ["button", entry("Button", "Input")],
  ["input", entry("Input", "Input")],
  ["textarea", entry("Textarea", "Input")],
  ["select", entry("Select", "Input")],
  ["checkbox", entry("Checkbox", "Input")],
  ["radio", entry("Radio", "Input")],
  ["switch", entry("Switch", "Input")],
  ["slider", entry("Slider", "Input")],
  ["formfield", entry("FormField", "Input")],

  // Display
  ["card", entry("Card", "Display")],
  ["badge", entry("Badge", "Display")],
  ["avatar", entry("Avatar", "Display")],
  ["tag", entry("Tag", "Display")],
  ["table", entry("Table", "Display")],
  ["datareadout", entry("DataReadout", "Display")],
  ["codeblock", entry("CodeBlock", "Display")],

  // Layout
  ["stack", entry("Stack", "Layout")],
  ["grid", entry("Grid", "Layout")],
  ["container", entry("Container", "Layout")],
  ["divider", entry("Divider", "Layout")],
  ["section", entry("Section", "Layout")],

  // Navigation
  ["link", entry("Link", "Navigation")],
  ["tabs", entry("Tabs", "Navigation")],
  ["breadcrumb", entry("Breadcrumb", "Navigation")],
  ["nav", entry("Nav", "Navigation")],

  // Feedback
  ["toast", entry("Toast", "Feedback")],
  ["alert", entry("Alert", "Feedback")],
  ["dialog", entry("Dialog", "Feedback")],
  ["tooltip", entry("Tooltip", "Feedback")],
  ["progress", entry("Progress", "Feedback")],
  ["spinner", entry("Spinner", "Feedback")],
  ["skeleton", entry("Skeleton", "Feedback")],
]);

export const VALID_CATEGORIES: ComponentCategory[] = [
  "Input",
  "Display",
  "Layout",
  "Navigation",
  "Feedback",
];
