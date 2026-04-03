import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("init: STRAND.md generation", () => {
  let tmpDir: string;
  let origCwd: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "strand-init-"));
    origCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(origCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("STRAND.md template contains pointer to HTML_REFERENCE.md", async () => {
    // Import the module to access the template indirectly via init
    const { init } = await import("../commands/init.js");
    await init();

    const strandMd = fs.readFileSync(
      path.join(tmpDir, "STRAND.md"),
      "utf-8",
    );
    expect(strandMd).toContain("HTML_REFERENCE.md");
  });

  it("STRAND.md template contains pointer to DESIGN_LANGUAGE.md", async () => {
    const { init } = await import("../commands/init.js");
    await init();

    const strandMd = fs.readFileSync(
      path.join(tmpDir, "STRAND.md"),
      "utf-8",
    );
    expect(strandMd).toContain("DESIGN_LANGUAGE.md");
  });

  it("STRAND.md is not overwritten if it already exists", async () => {
    const existing = "# Custom STRAND.md\nUser content here.\n";
    fs.writeFileSync(path.join(tmpDir, "STRAND.md"), existing);

    const { init } = await import("../commands/init.js");
    await init();

    const content = fs.readFileSync(
      path.join(tmpDir, "STRAND.md"),
      "utf-8",
    );
    expect(content).toBe(existing);
  });

  it("STRAND.md contains when/why context for agents", async () => {
    const { init } = await import("../commands/init.js");
    await init();

    const strandMd = fs.readFileSync(
      path.join(tmpDir, "STRAND.md"),
      "utf-8",
    );
    expect(strandMd).toContain("When building or modifying UI");
  });
});
