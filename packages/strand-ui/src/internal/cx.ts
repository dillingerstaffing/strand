/*! Strand UI | MIT License | dillingerstaffing.com */

/** Joins the truthy class names. `className` may arrive as a signal, so parts are stringified. */
export function cx(...parts: unknown[]): string {
  return parts
    .filter(Boolean)
    .map((p) => String(p))
    .join(" ");
}
