/**
 * Shared utilities for documentation generators.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Simple glob: find files matching a pattern in a directory.
 * Supports ** for recursive and * for single-level matching.
 * @param {string} dir - base directory
 * @param {string} pattern - glob pattern (e.g. "**\/*.css")
 * @returns {Promise<string[]>} - sorted absolute file paths
 */
export async function glob(dir, pattern) {
	const results = [];
	const ext = pattern.replace(/\*\*\/?\*/, "");

	async function walk(d) {
		const entries = await readdir(d, { withFileTypes: true });
		for (const entry of entries) {
			const full = join(d, entry.name);
			if (entry.isDirectory()) {
				await walk(full);
			} else if (!ext || full.endsWith(ext)) {
				results.push(full);
			}
		}
	}

	await walk(dir);
	return results.sort();
}

/**
 * Read a JSON file and parse it.
 */
export async function readJSON(filePath) {
	const content = await readFile(filePath, "utf8");
	return JSON.parse(content);
}

/**
 * Replace content between markers in a string.
 * @param {string} content - full file content
 * @param {string} startMarker - e.g. "<!-- GENERATED:FOO:START -->"
 * @param {string} endMarker - e.g. "<!-- GENERATED:FOO:END -->"
 * @param {string} replacement - new content between markers
 * @returns {string} - updated content
 */
export function replaceMarkerContent(content, startMarker, endMarker, replacement) {
	const startIdx = content.indexOf(startMarker);
	const endIdx = content.indexOf(endMarker);

	if (startIdx === -1 || endIdx === -1) {
		return content; // markers not found, return unchanged
	}

	const before = content.slice(0, startIdx + startMarker.length);
	const after = content.slice(endIdx);

	return `${before}\n${replacement}\n${after}`;
}

/**
 * Get the repo root from a script file path.
 */
export function getRepoRoot(importMetaUrl) {
	const __filename = fileURLToPath(importMetaUrl);
	return resolve(__filename, "../../..");
}
