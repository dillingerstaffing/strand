import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Node = { prelude: string; body?: string; children?: Node[] };

/** Parse comment-free CSS into style rules and the at-rules that wrap them. */
function parse(src: string, from = 0, until = src.length): { nodes: Node[]; end: number } {
  const nodes: Node[] = [];
  let buf = "";
  let i = from;
  while (i < until) {
    const ch = src[i];
    if (ch === "{") {
      const prelude = buf.replace(/\s+/g, " ").trim();
      buf = "";
      if (prelude.startsWith("@") && !/^@(font-face|page|counter-style|property)/.test(prelude)) {
        const inner = parse(src, i + 1, until);
        nodes.push({ prelude, children: inner.nodes });
        i = inner.end + 1;
        continue;
      }
      let depth = 1;
      let j = i + 1;
      while (j < until && depth > 0) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") depth--;
        j++;
      }
      const body = src
        .slice(i + 1, j - 1)
        .split(";")
        .map((d) => d.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join("; ");
      nodes.push({ prelude, body });
      i = j;
      continue;
    }
    if (ch === "}") return { nodes, end: i };
    if (ch === ";") {
      const statement = buf.replace(/\s+/g, " ").trim();
      if (statement) nodes.push({ prelude: statement, body: "" });
      buf = "";
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  return { nodes, end: until };
}

function render(nodes: Node[], depth = 0): string[] {
  const pad = "  ".repeat(depth);
  const out: string[] = [];
  for (const n of nodes) {
    if (n.children) {
      out.push(`${pad}${n.prelude} {`, ...render(n.children, depth + 1), `${pad}}`);
    } else if (n.body === "" && !n.prelude.includes("{")) {
      out.push(`${pad}${n.prelude};`);
    } else {
      out.push(`${pad}${n.prelude} { ${n.body} }`);
    }
  }
  return out;
}

/**
 * A stylesheet rendered as its rules, one per line, comments and formatting
 * gone. Two sheets that render the same are the same to a browser, so this is
 * what a stylesheet snapshot holds.
 */
export function rulesOf(css: string): string[] {
  return render(parse(css.replace(/\/\*[\s\S]*?\*\//g, "")).nodes);
}

/** One snapshot of a stylesheet: what a browser would read from it. */
export function snapshotStylesheet(cssPath: string): void {
  describe("stylesheet", () => {
    it("renders these rules", () => {
      expect(rulesOf(readFileSync(cssPath, "utf8")).join("\n")).toMatchSnapshot();
    });
  });
}
