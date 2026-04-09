import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { beforeAll, describe, expect, it } from "vitest";

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const SCRIPT_PATH = join(REPO_ROOT, "scripts/build-docs.mjs");

// ---------------------------------------------------------------------------
// Unit tests for individual generators (no I/O, pure functions)
// ---------------------------------------------------------------------------

import {
	extractStrandClasses,
	classifyBEM,
	mapToComponent,
} from "../generators/css-inventory.mjs";

import {
	generateComponentMarkdown,
} from "../generators/html-reference.mjs";

import {
	parseConventionalCommit,
	groupBySection,
	formatVersion,
} from "../generators/changelog.mjs";

import {
	generateConsumersMarkdown,
} from "../generators/consumers.mjs";

import {
	generateProjectStructure,
} from "../generators/contributing.mjs";

import {
	parseBulmaCompatCSS,
	parseBulmaSassVars,
	formatCSSVarsTable,
	formatSassVarsTable,
} from "../generators/migration-bulma.mjs";

import {
	extractTokenNames,
	crossCheckTokens,
	formatBootstrapTable,
} from "../generators/migration-bootstrap.mjs";

import {
	generateRegistryContent,
} from "../generators/registry.mjs";

import {
	generateLlmsTxt,
} from "../generators/llms.mjs";

import {
	replaceMarkerContent,
} from "../generators/utils.mjs";

// ---------------------------------------------------------------------------
// 1. css-inventory: extracts correct .strand-* classes
// ---------------------------------------------------------------------------

describe("css-inventory", () => {
	it("extracts .strand-* classes from CSS", () => {
		const css = `
.strand-btn { display: inline-flex; }
.strand-btn--primary { background: blue; }
.strand-btn__content { display: flex; }
.not-strand { color: red; }
.strand-card { padding: 1rem; }
`;
		const classes = extractStrandClasses(css);
		expect(classes.has("strand-btn")).toBe(true);
		expect(classes.has("strand-btn--primary")).toBe(true);
		expect(classes.has("strand-btn__content")).toBe(true);
		expect(classes.has("strand-card")).toBe(true);
		expect(classes.has("not-strand")).toBe(false);
		expect(classes.size).toBe(4);
	});

	it("classifies BEM types correctly", () => {
		expect(classifyBEM("strand-btn")).toBe("base");
		expect(classifyBEM("strand-btn--primary")).toBe("modifier");
		expect(classifyBEM("strand-btn__content")).toBe("child");
	});

	it("maps class names to components", () => {
		expect(mapToComponent("strand-btn")).toBe("Button");
		expect(mapToComponent("strand-btn--primary")).toBe("Button");
		expect(mapToComponent("strand-btn__content")).toBe("Button");
		expect(mapToComponent("strand-card")).toBe("Card");
		expect(mapToComponent("strand-table-wrapper")).toBe("Table");
		expect(mapToComponent("strand-unknown-thing")).toBeNull();
	});
});

// ---------------------------------------------------------------------------
// 2. html-reference: produces correct markdown with all classes listed
// ---------------------------------------------------------------------------

describe("html-reference", () => {
	const mockInventory = new Map([
		[
			"Button",
			{
				name: "Button",
				classes: [
					{ name: "strand-btn", type: "base" },
					{ name: "strand-btn--primary", type: "modifier" },
					{ name: "strand-btn__content", type: "child" },
					{ name: "strand-btn--undocumented", type: "modifier" },
				],
			},
		],
		[
			"Global",
			{
				name: "Global",
				classes: [{ name: "strand-overline", type: "base" }],
			},
		],
	]);

	const mockClassDocs = {
		components: [
			{
				name: "Button",
				description: "Primary action trigger.",
				classes: [
					{ class: "strand-btn", description: "Base button." },
					{ class: "strand-btn--primary", description: "Primary variant." },
					{ class: "strand-btn__content", description: "Content wrapper." },
				],
				example: '<button class="strand-btn">Label</button>',
			},
		],
		global: {
			name: "Global",
			description: "Utilities.",
			classes: [
				{ class: "strand-overline", description: "Specimen label." },
			],
		},
	};

	it("produces markdown with all classes listed", () => {
		const { markdown } = generateComponentMarkdown(
			mockInventory,
			mockClassDocs,
			"0.15.1",
		);
		expect(markdown).toContain("### Button");
		expect(markdown).toContain("strand-btn");
		expect(markdown).toContain("strand-btn--primary");
		expect(markdown).toContain("strand-btn__content");
		expect(markdown).toContain("Primary action trigger.");
	});

	it("includes undescribed CSS classes in output", () => {
		const { markdown } = generateComponentMarkdown(
			mockInventory,
			mockClassDocs,
			"0.15.1",
		);
		// strand-btn--undocumented is in CSS but not in class-docs.json
		expect(markdown).toContain("strand-btn--undocumented");
	});

	it("warns about class-docs.json entries not in CSS", () => {
		const docsWithMissing = {
			...mockClassDocs,
			components: [
				{
					name: "Button",
					description: "Test.",
					classes: [
						{ class: "strand-btn--missing", description: "Does not exist." },
					],
				},
			],
		};
		const { warnings } = generateComponentMarkdown(
			mockInventory,
			docsWithMissing,
			"0.15.1",
		);
		expect(warnings.length).toBeGreaterThan(0);
		expect(warnings[0]).toContain("strand-btn--missing");
	});

	it("includes usage example in markdown", () => {
		const { markdown } = generateComponentMarkdown(
			mockInventory,
			mockClassDocs,
			"0.15.1",
		);
		expect(markdown).toContain("**Usage:**");
		expect(markdown).toContain("```html");
	});
});

// ---------------------------------------------------------------------------
// 3. changelog: produces Keep a Changelog format from git output
// ---------------------------------------------------------------------------

describe("changelog", () => {
	it("parses conventional commits", () => {
		expect(parseConventionalCommit("feat: add button")).toEqual({
			type: "feat",
			description: "add button",
		});
		expect(parseConventionalCommit("fix(nav): scroll offset")).toEqual({
			type: "fix",
			description: "scroll offset",
		});
		expect(parseConventionalCommit("random message")).toEqual({
			type: "other",
			description: "random message",
		});
	});

	it("groups commits by changelog section", () => {
		const commits = [
			{ hash: "a1", subject: "feat: add dialog", date: "2026-04-01" },
			{ hash: "a2", subject: "fix: focus ring", date: "2026-04-02" },
			{ hash: "a3", subject: "docs: update readme", date: "2026-04-03" },
			{ hash: "a4", subject: "chore: bump version", date: "2026-04-04" },
		];
		const sections = groupBySection(commits);
		expect(sections.get("Added")).toEqual(["add dialog"]);
		expect(sections.get("Fixed")).toEqual(["focus ring"]);
		expect(sections.get("Documentation")).toEqual(["update readme"]);
		expect(sections.get("Changed")).toEqual(["bump version"]);
	});

	it("formats a version block", () => {
		const sections = new Map([
			["Added", ["new feature"]],
			["Fixed", ["bug fix"]],
		]);
		const output = formatVersion("0.15.1", "2026-04-01", sections);
		expect(output).toContain("## [0.15.1] - 2026-04-01");
		expect(output).toContain("### Added");
		expect(output).toContain("- new feature");
		expect(output).toContain("### Fixed");
		expect(output).toContain("- bug fix");
	});
});

// ---------------------------------------------------------------------------
// 4. consumers: produces correct CONSUMERS.md from consumers.json
// ---------------------------------------------------------------------------

describe("consumers", () => {
	const mockData = {
		consumers: [
			{
				id: "preact",
				name: "Preact",
				kind: "package",
				packageName: "@test/ui",
				packagePath: "packages/ui",
				install: "npm install @test/ui",
				parity: {
					type: "framework-components",
					assertion: "exports every component",
				},
			},
			{
				id: "tokens-only",
				name: "Tokens only",
				kind: "package",
				packageName: "@test/tokens",
				packagePath: "packages/tokens",
				install: "npm install @test/tokens",
				artifactPath: "packages/tokens/css/tokens.css",
				parity: {
					type: "tokens",
					assertion: "every token defined",
				},
			},
		],
	};

	it("produces markdown with all consumer types", () => {
		const md = generateConsumersMarkdown(mockData);
		expect(md).toContain("## 1. Preact");
		expect(md).toContain("## 2. Tokens only");
		expect(md).toContain("npm install @test/ui");
		expect(md).toContain("npm install @test/tokens");
	});

	it("includes parity obligations", () => {
		const md = generateConsumersMarkdown(mockData);
		expect(md).toContain("exports every component");
		expect(md).toContain("every token defined");
	});

	it("includes package paths", () => {
		const md = generateConsumersMarkdown(mockData);
		expect(md).toContain("`packages/ui/`");
		expect(md).toContain("`packages/tokens/`");
	});
});

// ---------------------------------------------------------------------------
// 5. contributing: produces correct project structure
// ---------------------------------------------------------------------------

describe("contributing", () => {
	it("generates project structure from real packages", async () => {
		const structure = await generateProjectStructure(REPO_ROOT);
		expect(structure).toContain("packages/tokens/");
		expect(structure).toContain("packages/strand-ui/");
		expect(structure).toContain("@dillingerstaffing/strand");
	});
});

// ---------------------------------------------------------------------------
// 6. migration-bulma: produces correct variable table from compat CSS
// ---------------------------------------------------------------------------

describe("migration-bulma", () => {
	it("parses CSS variable declarations", () => {
		const css = `
:root {
  --bulma-primary-h: 213deg;
  --bulma-scheme-main: var(--strand-surface-primary);
  --bulma-family-primary: var(--strand-font-sans);
}
`;
		const mappings = parseBulmaCompatCSS(css);
		expect(mappings.length).toBe(3);
		expect(mappings[0].bulma).toBe("--bulma-primary-h");
		expect(mappings[0].strand).toBe("213deg");
		expect(mappings[1].strand).toBe("--strand-surface-primary");
	});

	it("parses Sass variable declarations", () => {
		const scss = `
$strand-primary: #3B8EF6;        // --strand-blue-primary
$strand-family-sans: "Inter", system-ui, sans-serif;
$strand-radius: 6px;         // --strand-radius-md
`;
		const mappings = parseBulmaSassVars(scss);
		expect(mappings.length).toBe(3);
		expect(mappings[0].sass).toBe("$strand-primary");
		expect(mappings[0].value).toBe("#3B8EF6");
		expect(mappings[0].comment).toBe("--strand-blue-primary");
	});

	it("formats CSS vars as markdown table", () => {
		const table = formatCSSVarsTable([
			{ bulma: "--bulma-primary", strand: "--strand-blue-primary" },
		]);
		expect(table).toContain("| `--bulma-primary` |");
		expect(table).toContain("`var(--strand-blue-primary)`");
	});

	it("formats Sass vars as markdown table", () => {
		const table = formatSassVarsTable([
			{ sass: "$strand-primary", value: "#3B8EF6", comment: "--strand-blue-primary" },
		]);
		expect(table).toContain("| `$strand-primary` |");
		expect(table).toContain("| `#3B8EF6` |");
	});
});

// ---------------------------------------------------------------------------
// 7. migration-bootstrap: cross-checks correctly
// ---------------------------------------------------------------------------

describe("migration-bootstrap", () => {
	it("extracts token names from CSS", () => {
		const css = `
:root {
  --strand-blue-primary: #3B8EF6;
  --strand-gray-500: #64778B;
}
`;
		const tokens = extractTokenNames(css);
		expect(tokens.has("--strand-blue-primary")).toBe(true);
		expect(tokens.has("--strand-gray-500")).toBe(true);
		expect(tokens.size).toBe(2);
	});

	it("warns about missing tokens", () => {
		const mappings = [
			{ bootstrap: "--bs-primary", strand: "--strand-blue-primary" },
			{ bootstrap: "--bs-fancy", strand: "--strand-nonexistent" },
		];
		const tokens = new Set(["--strand-blue-primary"]);
		const warnings = crossCheckTokens(mappings, tokens);
		expect(warnings.length).toBe(1);
		expect(warnings[0]).toContain("--strand-nonexistent");
	});

	it("formats bootstrap table", () => {
		const table = formatBootstrapTable([
			{ bootstrap: "--bs-primary / $primary", strand: "--strand-blue-primary" },
		]);
		expect(table).toContain("| `--bs-primary / $primary` |");
		expect(table).toContain("| `--strand-blue-primary` |");
	});
});

// ---------------------------------------------------------------------------
// 8. readme: markers replaced correctly
// ---------------------------------------------------------------------------

describe("readme markers", () => {
	it("replaceMarkerContent replaces between markers", () => {
		const input = "before\n<!-- START -->\nold content\n<!-- END -->\nafter";
		const result = replaceMarkerContent(input, "<!-- START -->", "<!-- END -->", "new content");
		expect(result).toContain("<!-- START -->\nnew content\n<!-- END -->");
		expect(result).toContain("before");
		expect(result).toContain("after");
		expect(result).not.toContain("old content");
	});

	it("returns unchanged content if markers missing", () => {
		const input = "no markers here";
		const result = replaceMarkerContent(input, "<!-- START -->", "<!-- END -->", "new");
		expect(result).toBe(input);
	});
});

// ---------------------------------------------------------------------------
// 9. registry: correct format
// ---------------------------------------------------------------------------

describe("registry", () => {
	const mockManifest = {
		components: ["Button", "Card", "DataReadout"],
	};

	it("generates valid JSON with shadcn schema", () => {
		const content = generateRegistryContent(mockManifest);
		const registry = JSON.parse(content);
		expect(registry.$schema).toBe("https://ui.shadcn.com/schema/registry.json");
		expect(registry.name).toBe("strand");
	});

	it("contains all components with correct names", () => {
		const content = generateRegistryContent(mockManifest);
		const registry = JSON.parse(content);
		expect(registry.items.length).toBe(3);

		const names = registry.items.map((i) => i.name);
		expect(names).toContain("button");
		expect(names).toContain("card");
		expect(names).toContain("data-readout");
	});

	it("each item has required fields", () => {
		const content = generateRegistryContent(mockManifest);
		const registry = JSON.parse(content);
		for (const item of registry.items) {
			expect(item.name).toBeTruthy();
			expect(item.type).toBe("registry:ui");
			expect(item.title).toBeTruthy();
			expect(item.description).toBeTruthy();
			expect(Array.isArray(item.files)).toBe(true);
			expect(Array.isArray(item.dependencies)).toBe(true);
		}
	});
});

// ---------------------------------------------------------------------------
// 10. llms: correct format
// ---------------------------------------------------------------------------

describe("llms", () => {
	it("generates llms.txt with Strand header and sections", () => {
		const content = generateLlmsTxt();
		expect(content.startsWith("# Strand")).toBe(true);
		expect(content).toContain("## Docs");
		expect(content).toContain("## Optional");
		expect(content).toContain("README");
		expect(content).toContain("HTML Reference");
	});

	it("uses markdown link format", () => {
		const content = generateLlmsTxt();
		const linkPattern = /- \[.+\]\(https:\/\/.+\): .+/;
		expect(linkPattern.test(content)).toBe(true);
	});

	it("contains no em dashes", () => {
		const content = generateLlmsTxt();
		expect(content).not.toContain("\u2014");
		expect(content).not.toContain("\u2013");
	});
});

// ---------------------------------------------------------------------------
// Integration tests (run the actual script on the real repo)
// ---------------------------------------------------------------------------

describe("integration: build-docs script", () => {
	beforeAll(async () => {
		// Run the script
		await exec("node", [SCRIPT_PATH], { cwd: REPO_ROOT, timeout: 30000 });
	}, 45000);

	describe("HTML_REFERENCE.md", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "HTML_REFERENCE.md"), "utf8");
		});

		it("contains generated component reference markers", () => {
			expect(content).toContain("<!-- GENERATED:COMPONENT-REFERENCE:START -->");
			expect(content).toContain("<!-- GENERATED:COMPONENT-REFERENCE:END -->");
		});

		it("contains component sections for all documented components", () => {
			expect(content).toContain("### Button");
			expect(content).toContain("### Card");
			expect(content).toContain("### Nav");
			expect(content).toContain("### Alert");
		});
	});

	describe("CHANGELOG.md", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "CHANGELOG.md"), "utf8");
		});

		it("uses Keep a Changelog format", () => {
			expect(content).toContain("# Changelog");
			expect(content).toContain("Keep a Changelog");
			expect(content).toContain("Semantic Versioning");
		});
	});

	describe("CONSUMERS.md", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "CONSUMERS.md"), "utf8");
		});

		it("contains all consumer types from consumers.json", async () => {
			const data = JSON.parse(
				await readFile(join(REPO_ROOT, "consumers.json"), "utf8"),
			);
			for (const consumer of data.consumers) {
				expect(content).toContain(consumer.name);
			}
		});
	});

	describe("CONTRIBUTING.md", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "CONTRIBUTING.md"), "utf8");
		});

		it("contains generated project structure markers", () => {
			expect(content).toContain("<!-- GENERATED:PROJECT-STRUCTURE:START -->");
			expect(content).toContain("<!-- GENERATED:PROJECT-STRUCTURE:END -->");
		});

		it("lists packages", () => {
			expect(content).toContain("packages/tokens/");
			expect(content).toContain("packages/strand-ui/");
		});
	});

	describe("from-bulma.md", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(
				join(REPO_ROOT, "docs/migration/from-bulma.md"),
				"utf8",
			);
		});

		it("contains generated CSS vars markers", () => {
			expect(content).toContain("<!-- GENERATED:BULMA-CSS-VARS:START -->");
			expect(content).toContain("<!-- GENERATED:BULMA-CSS-VARS:END -->");
		});

		it("contains generated Sass vars markers", () => {
			expect(content).toContain("<!-- GENERATED:BULMA-SASS-VARS:START -->");
			expect(content).toContain("<!-- GENERATED:BULMA-SASS-VARS:END -->");
		});

		it("contains bulma variable table entries", () => {
			expect(content).toContain("--bulma-");
		});
	});

	describe("from-bootstrap.md", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(
				join(REPO_ROOT, "docs/migration/from-bootstrap.md"),
				"utf8",
			);
		});

		it("contains generated bootstrap vars markers", () => {
			expect(content).toContain("<!-- GENERATED:BOOTSTRAP-VARS:START -->");
			expect(content).toContain("<!-- GENERATED:BOOTSTRAP-VARS:END -->");
		});
	});

	describe("llms.txt", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "llms.txt"), "utf8");
		});

		it("exists and starts with Strand header", () => {
			expect(content.startsWith("# Strand")).toBe(true);
		});

		it("contains all expected sections", () => {
			expect(content).toContain("## Docs");
			expect(content).toContain("## Optional");
		});
	});

	describe("llms-full.txt", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "llms-full.txt"), "utf8");
		});

		it("contains content from multiple docs", () => {
			expect(content).toContain("Quick Start");
			expect(content).toContain("Strand HTML Reference");
		});
	});

	describe("registry.json", () => {
		let registry;

		beforeAll(async () => {
			const content = await readFile(join(REPO_ROOT, "registry.json"), "utf8");
			registry = JSON.parse(content);
		});

		it("has shadcn schema and correct item count", async () => {
			expect(registry.$schema).toBe("https://ui.shadcn.com/schema/registry.json");
			const manifest = JSON.parse(
				await readFile(join(REPO_ROOT, "parity-manifest.json"), "utf8"),
			);
			expect(registry.items.length).toBe(manifest.components.length);
		});
	});

	describe("README.md", () => {
		let readme;

		beforeAll(async () => {
			readme = await readFile(join(REPO_ROOT, "README.md"), "utf8");
		});

		it("has DOCMAP with content", () => {
			const match = readme.match(
				/<!-- DOCMAP:START -->([\s\S]*?)<!-- DOCMAP:END -->/,
			);
			expect(match).toBeTruthy();
			expect(match[1].trim().length).toBeGreaterThan(0);
		});

		it("has correct COMPONENT-COUNT", async () => {
			const manifest = JSON.parse(
				await readFile(join(REPO_ROOT, "parity-manifest.json"), "utf8"),
			);
			const match = readme.match(
				/<!-- COMPONENT-COUNT:START -->(\d+)<!-- COMPONENT-COUNT:END -->/,
			);
			expect(match).toBeTruthy();
			expect(Number.parseInt(match[1], 10)).toBe(manifest.components.length);
		});
	});

	describe("idempotency", () => {
		it("running the script twice produces identical output", async () => {
			// Read outputs after first run
			const [llms1, registry1, readme1, htmlRef1] = await Promise.all([
				readFile(join(REPO_ROOT, "llms.txt"), "utf8"),
				readFile(join(REPO_ROOT, "registry.json"), "utf8"),
				readFile(join(REPO_ROOT, "README.md"), "utf8"),
				readFile(join(REPO_ROOT, "HTML_REFERENCE.md"), "utf8"),
			]);

			// Run again
			await exec("node", [SCRIPT_PATH], { cwd: REPO_ROOT, timeout: 30000 });

			const [llms2, registry2, readme2, htmlRef2] = await Promise.all([
				readFile(join(REPO_ROOT, "llms.txt"), "utf8"),
				readFile(join(REPO_ROOT, "registry.json"), "utf8"),
				readFile(join(REPO_ROOT, "README.md"), "utf8"),
				readFile(join(REPO_ROOT, "HTML_REFERENCE.md"), "utf8"),
			]);

			expect(llms1).toBe(llms2);
			expect(registry1).toBe(registry2);
			expect(readme1).toBe(readme2);
			expect(htmlRef1).toBe(htmlRef2);
		}, 60000);
	});
});
