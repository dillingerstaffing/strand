import { describe, expect, it } from "vitest";
import type { ComponentType } from "preact";
import type { Fixture } from "./fixtures.js";
import { html } from "./render.js";

/** One snapshot per fixture, so a refactor proves it changed no markup. */
export function snapshotFixtures(Component: ComponentType<Record<string, unknown>>, fixtures: Fixture[]): void {
  describe("renders", () => {
    for (const f of fixtures) {
      it(f.name, () => {
        expect(html(<Component {...(f.props ?? {})}>{f.children}</Component>)).toMatchSnapshot();
      });
    }
  });
}
