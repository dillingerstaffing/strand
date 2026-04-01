import { describe, it, expect, vi, beforeEach } from "vitest";
import { list } from "../commands/list.js";
import { components, VALID_CATEGORIES } from "../registry.js";

describe("list command", () => {
  let output: string[];

  beforeEach(() => {
    output = [];
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      output.push(args.join(" "));
    });
  });

  it("outputs all component names", async () => {
    await list();
    const combined = output.join("\n");

    for (const [, entry] of components) {
      expect(combined).toContain(entry.name.toLowerCase());
    }
  });

  it("groups components by category", async () => {
    await list();
    const combined = output.join("\n");

    for (const category of VALID_CATEGORIES) {
      expect(combined).toContain(`${category}:`);
    }
  });

  it("shows the total count", async () => {
    await list();
    const combined = output.join("\n");

    expect(combined).toContain("31 components available.");
  });

  it("shows usage hint", async () => {
    await list();
    const combined = output.join("\n");

    expect(combined).toContain("strand add");
  });
});
