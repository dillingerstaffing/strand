import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const componentDir = resolve(__dirname, "../components");

const allComponents: { name: string; cssPath: string }[] = [
  { name: "Alert", cssPath: resolve(componentDir, "Alert/Alert.css") },
  { name: "Avatar", cssPath: resolve(componentDir, "Avatar/Avatar.css") },
  { name: "Badge", cssPath: resolve(componentDir, "Badge/Badge.css") },
  { name: "Breadcrumb", cssPath: resolve(componentDir, "Breadcrumb/Breadcrumb.css") },
  { name: "Button", cssPath: resolve(componentDir, "Button/Button.css") },
  { name: "Card", cssPath: resolve(componentDir, "Card/Card.css") },
  { name: "Checkbox", cssPath: resolve(componentDir, "Checkbox/Checkbox.css") },
  { name: "Container", cssPath: resolve(componentDir, "Container/Container.css") },
  { name: "DataReadout", cssPath: resolve(componentDir, "DataReadout/DataReadout.css") },
  { name: "Dialog", cssPath: resolve(componentDir, "Dialog/Dialog.css") },
  { name: "Divider", cssPath: resolve(componentDir, "Divider/Divider.css") },
  { name: "FormField", cssPath: resolve(componentDir, "FormField/FormField.css") },
  { name: "Grid", cssPath: resolve(componentDir, "Grid/Grid.css") },
  { name: "Input", cssPath: resolve(componentDir, "Input/Input.css") },
  { name: "Link", cssPath: resolve(componentDir, "Link/Link.css") },
  { name: "Nav", cssPath: resolve(componentDir, "Nav/Nav.css") },
  { name: "Progress", cssPath: resolve(componentDir, "Progress/Progress.css") },
  { name: "Radio", cssPath: resolve(componentDir, "Radio/Radio.css") },
  { name: "Section", cssPath: resolve(componentDir, "Section/Section.css") },
  { name: "Select", cssPath: resolve(componentDir, "Select/Select.css") },
  { name: "Skeleton", cssPath: resolve(componentDir, "Skeleton/Skeleton.css") },
  { name: "Slider", cssPath: resolve(componentDir, "Slider/Slider.css") },
  { name: "Spinner", cssPath: resolve(componentDir, "Spinner/Spinner.css") },
  { name: "Stack", cssPath: resolve(componentDir, "Stack/Stack.css") },
  { name: "Switch", cssPath: resolve(componentDir, "Switch/Switch.css") },
  { name: "Table", cssPath: resolve(componentDir, "Table/Table.css") },
  { name: "Tabs", cssPath: resolve(componentDir, "Tabs/Tabs.css") },
  { name: "Tag", cssPath: resolve(componentDir, "Tag/Tag.css") },
  { name: "Textarea", cssPath: resolve(componentDir, "Textarea/Textarea.css") },
  { name: "Toast", cssPath: resolve(componentDir, "Toast/Toast.css") },
  { name: "Tooltip", cssPath: resolve(componentDir, "Tooltip/Tooltip.css") },
];

describe("CSS design language compliance", () => {
  it("No component CSS uses raw hex colors except known exceptions", () => {
    // Known exceptions: rgba() for Tag tint backgrounds and Alert status backgrounds
    // (opacity variants without tokens yet)
    const rgbaExemptComponents = ["Tag", "Alert"];
    const violations: string[] = [];

    for (const { name, cssPath } of allComponents) {
      const css = readFileSync(cssPath, "utf-8");
      const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
      // Strip var() references
      const withoutVars = withoutComments.replace(/var\([^)]+\)/g, "VAR_REF");

      // For exempted components, also strip rgba() calls
      let searchable = withoutVars;
      if (rgbaExemptComponents.includes(name)) {
        searchable = searchable.replace(/rgba\([^)]+\)/g, "RGBA_REF");
      }

      const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
      let match: RegExpExecArray | null;
      while ((match = hexPattern.exec(searchable)) !== null) {
        violations.push(`${name}: ${match[0]}`);
      }
    }

    expect(violations, `Raw hex colors found:\n${violations.join("\n")}`).toEqual([]);
  });

  it("All component CSS uses only --strand- prefixed custom properties", () => {
    const violations: string[] = [];

    for (const { name, cssPath } of allComponents) {
      const css = readFileSync(cssPath, "utf-8");
      const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");

      // Find all var() references
      const varPattern = /var\(--([^)]+)\)/g;
      let match: RegExpExecArray | null;
      while ((match = varPattern.exec(withoutComments)) !== null) {
        const propName = match[1];
        if (!propName.startsWith("strand-")) {
          violations.push(`${name}: var(--${propName})`);
        }
      }
    }

    expect(
      violations,
      `Non --strand- prefixed custom properties found:\n${violations.join("\n")}`,
    ).toEqual([]);
  });

  it("Interactive components have correct hover transform", () => {
    // Button and Card (interactive) should have translateY(-1px) or translateY(-2px)
    const interactiveSpecs: { name: string; cssPath: string }[] = [
      { name: "Button", cssPath: resolve(componentDir, "Button/Button.css") },
      { name: "Card", cssPath: resolve(componentDir, "Card/Card.css") },
    ];

    for (const { name, cssPath } of interactiveSpecs) {
      const css = readFileSync(cssPath, "utf-8");
      const hasHoverTransform =
        css.includes("translateY(-1px)") || css.includes("translateY(-2px)");
      expect(
        hasHoverTransform,
        `${name} missing hover translateY(-1px) or translateY(-2px)`,
      ).toBe(true);
    }
  });

  it("Disabled states use opacity 0.4", () => {
    // Components with :disabled or --disabled class
    const componentsWithDisabled: { name: string; cssPath: string }[] = [
      { name: "Button", cssPath: resolve(componentDir, "Button/Button.css") },
      { name: "Checkbox", cssPath: resolve(componentDir, "Checkbox/Checkbox.css") },
      { name: "Input", cssPath: resolve(componentDir, "Input/Input.css") },
      { name: "Radio", cssPath: resolve(componentDir, "Radio/Radio.css") },
      { name: "Select", cssPath: resolve(componentDir, "Select/Select.css") },
      { name: "Slider", cssPath: resolve(componentDir, "Slider/Slider.css") },
      { name: "Switch", cssPath: resolve(componentDir, "Switch/Switch.css") },
      { name: "Textarea", cssPath: resolve(componentDir, "Textarea/Textarea.css") },
    ];

    for (const { name, cssPath } of componentsWithDisabled) {
      const css = readFileSync(cssPath, "utf-8");
      const hasDisabled = css.includes(":disabled") || css.includes("--disabled");
      expect(hasDisabled, `${name} expected to have disabled styles`).toBe(true);

      // Verify opacity: 0.4 is present
      expect(
        css,
        `${name} disabled state should use opacity: 0.4`,
      ).toContain("opacity: 0.4");
    }
  });
});
