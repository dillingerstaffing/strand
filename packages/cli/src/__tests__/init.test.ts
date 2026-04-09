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
    const { init } = await import("../commands/init.js");
    await init();

    const strandMd = fs.readFileSync(
      path.join(tmpDir, "STRAND.md"),
      "utf-8",
    );
    expect(strandMd).toContain("HTML_REFERENCE.md");
  });

  it("STRAND.md template contains pointer to design-language.md", async () => {
    const { init } = await import("../commands/init.js");
    await init();

    const strandMd = fs.readFileSync(
      path.join(tmpDir, "STRAND.md"),
      "utf-8",
    );
    expect(strandMd).toContain("design-language.md");
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

describe("init: framework detection", () => {
  let tmpDir: string;
  let origCwd: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "strand-detect-"));
    origCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(origCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("detects vue when vue is in dependencies", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { vue: "^3.5.0" } }),
    );
    const { detectFramework } = await import("../commands/init.js");
    expect(detectFramework()).toBe("vue");
  });

  it("detects svelte when svelte is in dependencies", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { svelte: "^4.0.0" } }),
    );
    const { detectFramework } = await import("../commands/init.js");
    expect(detectFramework()).toBe("svelte");
  });

  it("detects preact when preact is in dependencies", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { preact: "^10.0.0" } }),
    );
    const { detectFramework } = await import("../commands/init.js");
    expect(detectFramework()).toBe("preact");
  });

  it("detects preact when react is in dependencies", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { react: "^18.0.0" } }),
    );
    const { detectFramework } = await import("../commands/init.js");
    expect(detectFramework()).toBe("preact");
  });

  it("detects css-only when no framework in dependencies", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { express: "^4.0.0" } }),
    );
    const { detectFramework } = await import("../commands/init.js");
    expect(detectFramework()).toBe("css-only");
  });

  it("detects css-only when no package.json exists", async () => {
    const { detectFramework } = await import("../commands/init.js");
    expect(detectFramework()).toBe("css-only");
  });

  it("STRAND.md mentions Vue when vue detected", async () => {
    const { strandMdContent } = await import("../commands/init.js");
    const content = strandMdContent("vue");
    expect(content).toContain("strand-vue");
  });

  it("STRAND.md mentions Svelte when svelte detected", async () => {
    const { strandMdContent } = await import("../commands/init.js");
    const content = strandMdContent("svelte");
    expect(content).toContain("strand-svelte");
  });

  it("STRAND.md mentions CSS only when css-only detected", async () => {
    const { strandMdContent } = await import("../commands/init.js");
    const content = strandMdContent("css-only");
    expect(content).toContain("CSS only");
  });

  it("config includes framework field", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { vue: "^3.5.0" } }),
    );
    const { init } = await import("../commands/init.js");
    await init();

    const config = JSON.parse(
      fs.readFileSync(path.join(tmpDir, "strand.config.json"), "utf-8"),
    );
    expect(config.framework).toBe("vue");
  });
});
