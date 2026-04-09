/**
 * css-inventory.mjs
 *
 * Parses all CSS files under packages/strand-ui/src/ and extracts every
 * class matching the .strand-* pattern. Groups by component (derived from
 * BEM block name) or "Global" for static.css utilities.
 */

import { readFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { glob } from "./utils.mjs";

/**
 * Extract all .strand-* class names from a CSS string.
 * Returns a Set of class names (without the leading dot).
 */
export function extractStrandClasses(css) {
	const classes = new Set();
	// Match class selectors: .strand-something
	// Must handle compound selectors, pseudo-classes, media queries, etc.
	const pattern = /\.strand-[a-zA-Z0-9_-]+/g;
	let m = pattern.exec(css);
	while (m !== null) {
		classes.add(m[0].slice(1)); // remove leading dot
		m = pattern.exec(css);
	}
	return classes;
}

/**
 * Derive the component group name from a CSS class using BEM conventions.
 * strand-btn        -> Button
 * strand-btn--lg    -> Button
 * strand-btn__content -> Button
 * strand-card-section -> Global (not a component BEM block)
 */
const BEM_BLOCK_MAP = {
	"strand-btn": "Button",
	"strand-input": "Input",
	"strand-textarea": "Textarea",
	"strand-select": "Select",
	"strand-checkbox": "Checkbox",
	"strand-radio": "Radio",
	"strand-switch": "Switch",
	"strand-slider": "Slider",
	"strand-form-field": "FormField",
	"strand-card": "Card",
	"strand-badge": "Badge",
	"strand-avatar": "Avatar",
	"strand-tag": "Tag",
	"strand-table": "Table",
	"strand-data-readout": "DataReadout",
	"strand-code-block": "CodeBlock",
	"strand-code-inline": "CodeBlock",
	"strand-stack": "Stack",
	"strand-grid": "Grid",
	"strand-container": "Container",
	"strand-divider": "Divider",
	"strand-section": "Section",
	"strand-link": "Link",
	"strand-tabs": "Tabs",
	"strand-breadcrumb": "Breadcrumb",
	"strand-nav": "Nav",
	"strand-toast": "Toast",
	"strand-alert": "Alert",
	"strand-banner": "Banner",
	"strand-dialog": "Dialog",
	"strand-tooltip": "Tooltip",
	"strand-progress": "Progress",
	"strand-spinner": "Spinner",
	"strand-skeleton": "Skeleton",
	"strand-instrument-viewport": "InstrumentViewport",
	"strand-reveal": "ScrollReveal",
	"strand-reveal-group": "ScrollReveal",
	"strand-table-wrapper": "Table",
};

/**
 * Classify a strand class as base, modifier, or child.
 */
export function classifyBEM(className) {
	if (className.includes("__")) return "child";
	if (className.includes("--")) return "modifier";
	return "base";
}

/**
 * Map a class name to its component group, or null for Global.
 */
export function mapToComponent(className) {
	// Try exact match first
	if (BEM_BLOCK_MAP[className]) return BEM_BLOCK_MAP[className];

	// Extract BEM block: everything before __ or --
	const blockMatch = className.match(/^(strand-[a-z][a-z0-9-]*?)(?:__|--)/);
	if (blockMatch) {
		const block = blockMatch[1];
		if (BEM_BLOCK_MAP[block]) return BEM_BLOCK_MAP[block];
	}

	return null; // Global
}

/**
 * Build a full CSS class inventory from the repo.
 * @param {string} repoRoot - absolute path to repo root
 * @returns {Promise<Map<string, {name: string, classes: {name: string, type: string}[]}>>}
 */
export async function buildInventory(repoRoot) {
	const componentDir = resolve(
		repoRoot,
		"packages/strand-ui/src/components",
	);
	const staticCss = resolve(repoRoot, "packages/strand-ui/src/static.css");

	// Collect all CSS files
	const cssFiles = await glob(componentDir, "**/*.css");
	cssFiles.push(staticCss);

	const inventory = new Map();

	for (const file of cssFiles) {
		const css = await readFile(file, "utf8");
		const classes = extractStrandClasses(css);
		const isStatic = file === staticCss;
		const dirName = isStatic ? null : basename(dirname(file));

		for (const cls of classes) {
			const component = isStatic
				? (mapToComponent(cls) || "Global")
				: (mapToComponent(cls) || dirName || "Global");
			const type = classifyBEM(cls);

			if (!inventory.has(component)) {
				inventory.set(component, { name: component, classes: [] });
			}

			// Avoid duplicates
			const group = inventory.get(component);
			if (!group.classes.some((c) => c.name === cls)) {
				group.classes.push({ name: cls, type });
			}
		}
	}

	return inventory;
}
