import {
  components,
  VALID_CATEGORIES,
  type ComponentCategory,
} from "../registry.js";

export async function list(): Promise<void> {
  console.log("Strand UI Components\n");

  const grouped = new Map<ComponentCategory, string[]>();

  for (const category of VALID_CATEGORIES) {
    grouped.set(category, []);
  }

  for (const [, entry] of components) {
    const list = grouped.get(entry.category);
    if (list) {
      list.push(entry.name);
    }
  }

  for (const category of VALID_CATEGORIES) {
    const names = grouped.get(category)!;
    if (names.length === 0) continue;

    console.log(`${category}:`);
    for (const name of names) {
      console.log(`  ${name.toLowerCase()}`);
    }
    console.log();
  }

  console.log(`${components.size} components available.`);
  console.log('Run `strand-ui add <name>` to add a component.');
}
