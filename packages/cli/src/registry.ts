export type ComponentCategory =
  | "Input"
  | "Display"
  | "Layout"
  | "Navigation"
  | "Feedback";

export interface ComponentEntry {
  name: string;
  category: ComponentCategory;
  files: string[];
}

export const components: Map<string, ComponentEntry> = new Map([
  // Input
  [
    "button",
    {
      name: "Button",
      category: "Input",
      files: ["Button.tsx", "Button.css", "index.ts"],
    },
  ],
  [
    "input",
    {
      name: "Input",
      category: "Input",
      files: ["Input.tsx", "Input.css", "index.ts"],
    },
  ],
  [
    "textarea",
    {
      name: "Textarea",
      category: "Input",
      files: ["Textarea.tsx", "Textarea.css", "index.ts"],
    },
  ],
  [
    "select",
    {
      name: "Select",
      category: "Input",
      files: ["Select.tsx", "Select.css", "index.ts"],
    },
  ],
  [
    "checkbox",
    {
      name: "Checkbox",
      category: "Input",
      files: ["Checkbox.tsx", "Checkbox.css", "index.ts"],
    },
  ],
  [
    "radio",
    {
      name: "Radio",
      category: "Input",
      files: ["Radio.tsx", "Radio.css", "index.ts"],
    },
  ],
  [
    "switch",
    {
      name: "Switch",
      category: "Input",
      files: ["Switch.tsx", "Switch.css", "index.ts"],
    },
  ],
  [
    "slider",
    {
      name: "Slider",
      category: "Input",
      files: ["Slider.tsx", "Slider.css", "index.ts"],
    },
  ],
  [
    "formfield",
    {
      name: "FormField",
      category: "Input",
      files: ["FormField.tsx", "FormField.css", "index.ts"],
    },
  ],

  // Display
  [
    "card",
    {
      name: "Card",
      category: "Display",
      files: ["Card.tsx", "Card.css", "index.ts"],
    },
  ],
  [
    "badge",
    {
      name: "Badge",
      category: "Display",
      files: ["Badge.tsx", "Badge.css", "index.ts"],
    },
  ],
  [
    "avatar",
    {
      name: "Avatar",
      category: "Display",
      files: ["Avatar.tsx", "Avatar.css", "index.ts"],
    },
  ],
  [
    "tag",
    {
      name: "Tag",
      category: "Display",
      files: ["Tag.tsx", "Tag.css", "index.ts"],
    },
  ],
  [
    "table",
    {
      name: "Table",
      category: "Display",
      files: ["Table.tsx", "Table.css", "index.ts"],
    },
  ],
  [
    "datareadout",
    {
      name: "DataReadout",
      category: "Display",
      files: ["DataReadout.tsx", "DataReadout.css", "index.ts"],
    },
  ],

  // Layout
  [
    "stack",
    {
      name: "Stack",
      category: "Layout",
      files: ["Stack.tsx", "Stack.css", "index.ts"],
    },
  ],
  [
    "grid",
    {
      name: "Grid",
      category: "Layout",
      files: ["Grid.tsx", "Grid.css", "index.ts"],
    },
  ],
  [
    "container",
    {
      name: "Container",
      category: "Layout",
      files: ["Container.tsx", "Container.css", "index.ts"],
    },
  ],
  [
    "divider",
    {
      name: "Divider",
      category: "Layout",
      files: ["Divider.tsx", "Divider.css", "index.ts"],
    },
  ],
  [
    "section",
    {
      name: "Section",
      category: "Layout",
      files: ["Section.tsx", "Section.css", "index.ts"],
    },
  ],

  // Navigation
  [
    "link",
    {
      name: "Link",
      category: "Navigation",
      files: ["Link.tsx", "Link.css", "index.ts"],
    },
  ],
  [
    "tabs",
    {
      name: "Tabs",
      category: "Navigation",
      files: ["Tabs.tsx", "Tabs.css", "index.ts"],
    },
  ],
  [
    "breadcrumb",
    {
      name: "Breadcrumb",
      category: "Navigation",
      files: ["Breadcrumb.tsx", "Breadcrumb.css", "index.ts"],
    },
  ],
  [
    "nav",
    {
      name: "Nav",
      category: "Navigation",
      files: ["Nav.tsx", "Nav.css", "index.ts"],
    },
  ],

  // Feedback
  [
    "toast",
    {
      name: "Toast",
      category: "Feedback",
      files: ["Toast.tsx", "Toast.css", "index.ts"],
    },
  ],
  [
    "alert",
    {
      name: "Alert",
      category: "Feedback",
      files: ["Alert.tsx", "Alert.css", "index.ts"],
    },
  ],
  [
    "dialog",
    {
      name: "Dialog",
      category: "Feedback",
      files: ["Dialog.tsx", "Dialog.css", "index.ts"],
    },
  ],
  [
    "tooltip",
    {
      name: "Tooltip",
      category: "Feedback",
      files: ["Tooltip.tsx", "Tooltip.css", "index.ts"],
    },
  ],
  [
    "progress",
    {
      name: "Progress",
      category: "Feedback",
      files: ["Progress.tsx", "Progress.css", "index.ts"],
    },
  ],
  [
    "spinner",
    {
      name: "Spinner",
      category: "Feedback",
      files: ["Spinner.tsx", "Spinner.css", "index.ts"],
    },
  ],
  [
    "skeleton",
    {
      name: "Skeleton",
      category: "Feedback",
      files: ["Skeleton.tsx", "Skeleton.css", "index.ts"],
    },
  ],
]);

export const VALID_CATEGORIES: ComponentCategory[] = [
  "Input",
  "Display",
  "Layout",
  "Navigation",
  "Feedback",
];
