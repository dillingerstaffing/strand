/**
 * changelog.mjs
 *
 * Generates CHANGELOG.md from git history using conventional commits.
 * Groups commits by type between tags. Uses Keep a Changelog format.
 */

import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);

/**
 * Get all version tags sorted by version descending.
 * @param {string} cwd - working directory
 * @returns {Promise<string[]>}
 */
export async function getVersionTags(cwd) {
	try {
		const { stdout } = await exec("git", ["tag", "-l", "v*", "--sort=-v:refname"], { cwd });
		return stdout.trim().split("\n").filter(Boolean);
	} catch {
		return [];
	}
}

/**
 * Get commits between two refs (or since a tag to HEAD).
 * @param {string} cwd
 * @param {string} from - start ref (exclusive)
 * @param {string} [to] - end ref (inclusive), defaults to HEAD
 * @returns {Promise<Array<{hash: string, subject: string, date: string}>>}
 */
export async function getCommitsBetween(cwd, from, to) {
	const range = to ? `${from}..${to}` : `${from}..HEAD`;
	try {
		const { stdout } = await exec(
			"git",
			["log", "--format=%H|%s|%ad", "--date=short", range],
			{ cwd },
		);
		return stdout
			.trim()
			.split("\n")
			.filter(Boolean)
			.map((line) => {
				const parts = line.split("|");
				return {
					hash: parts[0],
					subject: parts.slice(1, -1).join("|"),
					date: parts[parts.length - 1],
				};
			});
	} catch {
		return [];
	}
}

/**
 * Parse a conventional commit subject into type and description.
 */
export function parseConventionalCommit(subject) {
	const match = subject.match(/^(\w+)(?:\(.+?\))?!?:\s*(.+)$/);
	if (!match) return { type: "other", description: subject };
	return { type: match[1].toLowerCase(), description: match[2] };
}

/**
 * Map conventional commit types to Keep a Changelog sections.
 */
const TYPE_SECTIONS = {
	feat: "Added",
	fix: "Fixed",
	docs: "Documentation",
	style: "Changed",
	refactor: "Changed",
	perf: "Changed",
	test: "Changed",
	chore: "Changed",
	build: "Changed",
	ci: "Changed",
	revert: "Removed",
	other: "Changed",
};

/**
 * Group commits by their changelog section.
 * @param {Array<{hash: string, subject: string, date: string}>} commits
 * @returns {Map<string, string[]>}
 */
export function groupBySection(commits) {
	const sections = new Map();
	for (const commit of commits) {
		const { type, description } = parseConventionalCommit(commit.subject);
		const section = TYPE_SECTIONS[type] || "Changed";
		if (!sections.has(section)) sections.set(section, []);
		sections.get(section).push(description);
	}
	return sections;
}

/**
 * Format grouped commits into changelog markdown for one version.
 * @param {string} version - version string (e.g. "0.15.1")
 * @param {string} date - release date
 * @param {Map<string, string[]>} sections
 * @returns {string}
 */
export function formatVersion(version, date, sections) {
	const lines = [];
	lines.push(`## [${version}] - ${date}`);
	lines.push("");

	const sectionOrder = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security", "Documentation"];

	for (const sectionName of sectionOrder) {
		const items = sections.get(sectionName);
		if (!items || items.length === 0) continue;
		lines.push(`### ${sectionName}`);
		for (const item of items) {
			lines.push(`- ${item}`);
		}
		lines.push("");
	}

	return lines.join("\n");
}

/**
 * Generate the complete CHANGELOG.md content.
 * @param {string} repoRoot
 * @returns {Promise<string>}
 */
export async function generateChangelogContent(repoRoot) {
	const tags = await getVersionTags(repoRoot);
	const lines = [];

	lines.push("# Changelog");
	lines.push("");
	lines.push("All notable changes to this project will be documented in this file.");
	lines.push("");
	lines.push("The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),");
	lines.push("and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).");
	lines.push("");

	if (tags.length === 0) {
		lines.push("## [Unreleased]");
		lines.push("");
		lines.push("Initial development.");
		lines.push("");
	} else {
		// Unreleased section: commits after latest tag
		const latestTag = tags[0];
		const unreleased = await getCommitsBetween(repoRoot, latestTag);
		if (unreleased.length > 0) {
			const sections = groupBySection(unreleased);
			lines.push("## [Unreleased]");
			lines.push("");
			const sectionOrder = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security", "Documentation"];
			for (const sectionName of sectionOrder) {
				const items = sections.get(sectionName);
				if (!items || items.length === 0) continue;
				lines.push(`### ${sectionName}`);
				for (const item of items) {
					lines.push(`- ${item}`);
				}
				lines.push("");
			}
		}

		// Tagged releases
		for (let i = 0; i < tags.length; i++) {
			const tag = tags[i];
			const version = tag.replace(/^v/, "");
			const prevTag = tags[i + 1];

			// Get the tag date
			try {
				const { stdout: dateOut } = await exec(
					"git",
					["log", "-1", "--format=%ad", "--date=short", tag],
					{ cwd: repoRoot },
				);
				const date = dateOut.trim();

				if (prevTag) {
					const commits = await getCommitsBetween(repoRoot, prevTag, tag);
					const sections = groupBySection(commits);
					lines.push(formatVersion(version, date, sections));
				} else {
					// First tag, get all commits up to it
					try {
						const { stdout } = await exec(
							"git",
							["log", "--format=%H|%s|%ad", "--date=short", tag],
							{ cwd: repoRoot },
						);
						const commits = stdout
							.trim()
							.split("\n")
							.filter(Boolean)
							.map((line) => {
								const parts = line.split("|");
								return {
									hash: parts[0],
									subject: parts.slice(1, -1).join("|"),
									date: parts[parts.length - 1],
								};
							});
						const sections = groupBySection(commits);
						lines.push(formatVersion(version, date, sections));
					} catch {
						lines.push(`## [${version}] - ${date}`);
						lines.push("");
						lines.push("Initial release.");
						lines.push("");
					}
				}
			} catch {
				lines.push(`## [${version}]`);
				lines.push("");
			}
		}
	}

	lines.push("> For releases before the first tagged version, see git history.");
	lines.push("");

	return lines.join("\n");
}

/**
 * Generate and write CHANGELOG.md.
 */
export async function generateChangelog(repoRoot) {
	const content = await generateChangelogContent(repoRoot);
	await writeFile(resolve(repoRoot, "CHANGELOG.md"), content, "utf8");
	return { file: "CHANGELOG.md" };
}
