/**
 * registry.mjs
 *
 * Generates registry.json in shadcn-compatible format from
 * parity-manifest.json. Port from build-agent-surfaces.mjs.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readJSON } from "./utils.mjs";

const COMPONENT_DESCRIPTIONS = {
	Alert: "Persistent notification",
	Avatar: "User/entity representation",
	Badge: "Status/count indicator",
	Breadcrumb: "Hierarchical location",
	Button: "Primary action trigger",
	Card: "Content container",
	Checkbox: "Binary toggle (multiple)",
	CodeBlock: "Code snippet display",
	Container: "Width constraint",
	DataReadout: "Monospace metric display",
	Dialog: "Modal overlay",
	Divider: "Visual separator",
	FormField: "Label + input + hint + error wrapper",
	Grid: "Grid layout primitive",
	Input: "Single-line text entry",
	InstrumentViewport: "Dark instrument panel container",
	Link: "Inline navigation",
	Nav: "Site/app navigation",
	Progress: "Completion indicator",
	Radio: "Single selection from set",
	ScrollReveal: "Scroll-triggered entrance animation",
	Section: "Page section",
	Select: "Option selection",
	Skeleton: "Content placeholder",
	Slider: "Range value selection",
	Spinner: "Loading indicator",
	Stack: "Flex layout primitive",
	Switch: "Binary toggle (single)",
	Table: "Tabular data display",
	Tabs: "Content switching",
	Tag: "Categorization label",
	Textarea: "Multi-line text entry",
	Toast: "Transient notification",
	Tooltip: "Contextual hint",
};

function toKebab(name) {
	return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function toTitle(name) {
	return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

/**
 * Generate registry.json content.
 * @param {object} manifest - parsed parity-manifest.json
 * @returns {string} - JSON string
 */
export function generateRegistryContent(manifest) {
	const items = manifest.components.map((name) => {
		const kebab = toKebab(name);
		const title = toTitle(name);
		const description = COMPONENT_DESCRIPTIONS[name] || title;

		return {
			name: kebab,
			type: "registry:ui",
			title,
			description,
			files: [{ path: `components/${name}.tsx`, type: "registry:ui" }],
			dependencies: ["@dillingerstaffing/strand"],
			registryDependencies: [],
		};
	});

	return `${JSON.stringify(
		{
			$schema: "https://ui.shadcn.com/schema/registry.json",
			name: "strand",
			homepage: "https://github.com/dillingerstaffing/strand",
			items,
		},
		null,
		2,
	)}\n`;
}

/**
 * Generate and write registry.json.
 */
export async function generateRegistry(repoRoot) {
	const manifest = await readJSON(resolve(repoRoot, "parity-manifest.json"));
	const content = generateRegistryContent(manifest);
	await writeFile(resolve(repoRoot, "generated/registry.json"), content, "utf8");
	return { file: "generated/registry.json", componentCount: manifest.components.length };
}
