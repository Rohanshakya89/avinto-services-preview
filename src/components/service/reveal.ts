import { cn } from "cn"

/**
 * Entrance for anything in a service showcase that must not be visible until
 * its moment: it stays fully hidden (but keeps its space, so nothing shifts),
 * then eases in with a small rise. Use it on the whole element, including its
 * label or divider, so no part of it shows early.
 *
 * `extra` is for the element's own classes; colour changes on the element
 * transition along with the entrance. `fast` shortens it for stages with many
 * quick steps.
 */
export function reveal(shown: boolean, extra?: string, fast = false) {
  return cn(
    "transition-[opacity,translate,background-color,border-color,color] [transition-timing-function:var(--ease-out)] motion-reduce:transition-none",
    fast ? "duration-[450ms]" : "duration-[600ms]",
    shown
      ? "translate-y-0 opacity-100"
      : "pointer-events-none translate-y-2 opacity-0",
    extra
  )
}
