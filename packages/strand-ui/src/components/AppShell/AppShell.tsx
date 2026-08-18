/*! Strand UI | MIT License | dillingerstaffing.com */

import type { JSX } from "preact";
import { styled } from "../../internal/index.js";

/** The bounded frame an application sits inside; not a content width, use `Container` within it. */
export const AppShell = styled("div", "strand-app-shell", "AppShell");
export type AppShellProps = JSX.HTMLAttributes<HTMLDivElement>;
