/*! Strand UI | MIT License | dillingerstaffing.com */

export type ClassValue = string | false | null | undefined | 0;

/** Joins the truthy class names. */
export function cx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(" ");
}
