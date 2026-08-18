/*! Strand UI | MIT License | dillingerstaffing.com */

import type { Ref } from "preact";

/** One ref callback that fills every ref given, object or function. */
export function mergeRefs<T>(...refs: Array<Ref<T> | null | undefined>): (el: T | null) => void {
  return (el) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(el);
      else (ref as { current: T | null }).current = el;
    }
  };
}
