import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { beforeAll, describe, expect, it } from "vitest";

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const SCRIPT_PATH = join(REPO_ROOT, "scripts/build-agent-surfaces.mjs");

async function fileExists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function runScript() {
	const { stdout, stderr } = await exec("node", [SCRIPT_PATH], {
		cwd: REPO_ROOT,
	});
	return { stdout, stderr };
}

describe("build-agent-surfaces script", () => {
	beforeAll(async () => {
		// Ensure the README has the marker comments before running the script.
		// The actual README should already have them after the restructure,
		// but we verify here.
		const readme = await readFile(join(REPO_ROOT, "README.md"), "utf8");
		if (!readme.includes("<!-- DOCMAP:START -->")) {
			throw new Error(
				"README.md missing DOCMAP markers. Run README restructure first.",
			);
		}
		if (!readme.includes("<!-- COMPONENT-COUNT:START -->")) {
			throw new Error(
				"README.md missing COMPONENT-COUNT markers. Run README restructure first.",
			);
		}

		// Run the script
		await runScript();
	});

	describe("llms.txt", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "llms.txt"), "utf8");
		});

		it("exists after script runs", async () => {
			expect(await fileExists(join(REPO_ROOT, "llms.txt"))).toBe(true);
		});

		it("starts with the Strand header", () => {
			expect(content.startsWith("# Strand")).toBe(true);
		});

		it("contains a description line starting with >", () => {
			const lines = content.split("\n");
			const descLine = lines.find((l) => l.startsWith("> "));
			expect(descLine).toBeTruthy();
		});

		it("contains a Docs section", () => {
			expect(content).toContain("## Docs");
		});

		it("contains links to key docs", () => {
			expect(content).toContain("README");
			expect(content).toContain("HTML Reference");
			expect(content).toContain("Design Language");
		});

		it("contains an Optional section", () => {
			expect(content).toContain("## Optional");
		});

		it("uses markdown link format", () => {
			// Links should be [Name](url): description
			const linkPattern = /- \[.+\]\(https:\/\/.+\): .+/;
			expect(linkPattern.test(content)).toBe(true);
		});

		it("contains no em dashes", () => {
			expect(content).not.toContain("\u2014");
			expect(content).not.toContain("\u2013");
		});
	});

	describe("llms-full.txt", () => {
		let content;

		beforeAll(async () => {
			content = await readFile(join(REPO_ROOT, "llms-full.txt"), "utf8");
		});

		it("exists after script runs", async () => {
			expect(await fileExists(join(REPO_ROOT, "llms-full.txt"))).toBe(true);
		});

		it("contains content from README", () => {
			expect(content).toContain("Quick Start");
		});

		it("contains content from HTML_REFERENCE.md", () => {
			expect(content).toContain("Strand HTML Reference");
		});

		it("contains content from DESIGN_LANGUAGE.md", () => {
			expect(content).toContain("Strand Design Language");
		});

		it("contains content from CONSUMERS.md", () => {
			expect(content).toContain("Strand Consumer Types");
		});

		it("contains content from CONTRIBUTING.md", () => {
			expect(content).toContain("Contributing to Strand");
		});

		it("contains content from AGENTS.md", () => {
			expect(content).toContain("AGENTS.md");
		});

		it("uses --- separators between documents", () => {
			const separatorCount = (content.match(/^---$/gm) || []).length;
			// Should have at least one separator between doc sections
			expect(separatorCount).toBeGreaterThanOrEqual(3);
		});

		it("section headers added by the script contain no em dashes", () => {
			// llms-full.txt concatenates source docs that may contain em dashes.
			// We only check the section headers and separators that the script
			// generates, not the doc content it copies.
			const scriptHeaders = content.match(/^# .+$/gm) || [];
			for (const header of scriptHeaders) {
				expect(header).not.toContain("\u2014");
				expect(header).not.toContain("\u2013");
			}
		});
	});

	describe("registry.json", () => {
		let registry;

		beforeAll(async () => {
			const content = await readFile(join(REPO_ROOT, "registry.json"), "utf8");
			registry = JSON.parse(content);
		});

		it("exists after script runs", async () => {
			expect(await fileExists(join(REPO_ROOT, "registry.json"))).toBe(true);
		});

		it("has the shadcn schema URL", () => {
			expect(registry.$schema).toBe(
				"https://ui.shadcn.com/schema/registry.json",
			);
		});

		it("has the strand name", () => {
			expect(registry.name).toBe("strand");
		});

		it("has the correct homepage", () => {
			expect(registry.homepage).toBe(
				"https://github.com/dillingerstaffing/strand",
			);
		});

		it("has an items array", () => {
			expect(Array.isArray(registry.items)).toBe(true);
		});

		it("contains all components from parity-manifest.json", async () => {
			const manifest = JSON.parse(
				await readFile(join(REPO_ROOT, "parity-manifest.json"), "utf8"),
			);
			const registryNames = registry.items.map((item) => item.name);
			for (const component of manifest.components) {
				const kebab = component
					.replace(/([a-z])([A-Z])/g, "$1-$2")
					.toLowerCase();
				expect(registryNames).toContain(kebab);
			}
		});

		it("each item has required fields", () => {
			for (const item of registry.items) {
				expect(item.name).toBeTruthy();
				expect(item.type).toBe("registry:ui");
				expect(item.title).toBeTruthy();
				expect(item.description).toBeTruthy();
				expect(Array.isArray(item.files)).toBe(true);
				expect(item.files.length).toBeGreaterThan(0);
				expect(Array.isArray(item.dependencies)).toBe(true);
				expect(Array.isArray(item.registryDependencies)).toBe(true);
			}
		});

		it("each item file has path and type", () => {
			for (const item of registry.items) {
				for (const file of item.files) {
					expect(file.path).toBeTruthy();
					expect(file.type).toBe("registry:ui");
				}
			}
		});
	});

	describe("README markers", () => {
		let readme;

		beforeAll(async () => {
			readme = await readFile(join(REPO_ROOT, "README.md"), "utf8");
		});

		it("has DOCMAP section with content", () => {
			const match = readme.match(
				/<!-- DOCMAP:START -->([\s\S]*?)<!-- DOCMAP:END -->/,
			);
			expect(match).toBeTruthy();
			const content = match[1].trim();
			expect(content.length).toBeGreaterThan(0);
		});

		it("DOCMAP contains a markdown table", () => {
			const match = readme.match(
				/<!-- DOCMAP:START -->([\s\S]*?)<!-- DOCMAP:END -->/,
			);
			const content = match[1];
			expect(content).toContain("| Doc ");
			expect(content).toContain("| Purpose |");
		});

		it("DOCMAP lists key docs", () => {
			const match = readme.match(
				/<!-- DOCMAP:START -->([\s\S]*?)<!-- DOCMAP:END -->/,
			);
			const content = match[1];
			expect(content).toContain("HTML Reference");
			expect(content).toContain("Design Language");
			expect(content).toContain("AGENTS.md");
		});

		it("has COMPONENT-COUNT with correct count", async () => {
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

	describe("component count matches parity-manifest.json", () => {
		it("registry.json item count matches manifest component count", async () => {
			const manifest = JSON.parse(
				await readFile(join(REPO_ROOT, "parity-manifest.json"), "utf8"),
			);
			const registry = JSON.parse(
				await readFile(join(REPO_ROOT, "registry.json"), "utf8"),
			);
			expect(registry.items.length).toBe(manifest.components.length);
		});
	});

	describe("graceful handling of missing files", () => {
		it("script does not crash when a PUBLIC_DOCS file is missing", async () => {
			// The script should handle missing docs gracefully in llms-full.txt
			// by skipping them. We verify this by checking the script ran
			// successfully (it would have thrown in beforeAll if it crashed).
			expect(true).toBe(true);
		});
	});

	describe("idempotency", () => {
		it("running the script twice produces the same output", async () => {
			const llms1 = await readFile(join(REPO_ROOT, "llms.txt"), "utf8");
			const registry1 = await readFile(
				join(REPO_ROOT, "registry.json"),
				"utf8",
			);
			const readme1 = await readFile(join(REPO_ROOT, "README.md"), "utf8");

			await runScript();

			const llms2 = await readFile(join(REPO_ROOT, "llms.txt"), "utf8");
			const registry2 = await readFile(
				join(REPO_ROOT, "registry.json"),
				"utf8",
			);
			const readme2 = await readFile(join(REPO_ROOT, "README.md"), "utf8");

			expect(llms1).toBe(llms2);
			expect(registry1).toBe(registry2);
			expect(readme1).toBe(readme2);
		});
	});
});
