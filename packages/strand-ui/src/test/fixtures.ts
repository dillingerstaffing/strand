/** One rendering of a component: a name, props, and optional text children. */
export interface Fixture {
  name: string;
  props?: Record<string, unknown>;
  children?: string;
}
