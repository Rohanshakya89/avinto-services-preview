import * as React from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "cn"

type PillButtonProps = React.ComponentProps<"button"> & {
  label: string
  /** Show the trailing arrow. */
  arrow?: boolean
  size?: "sm" | "lg"
}

const SIZES = {
  sm: "h-10 gap-2 px-5 text-base",
  lg: "h-12 gap-2 px-6 text-base",
} as const

/** Solid brand pill with an optional arrow that nudges forward on hover. */
export function PillButton({
  label,
  arrow = false,
  size = "lg",
  className,
  ...props
}: PillButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group/pill inline-flex items-center justify-center rounded-full bg-primary font-medium whitespace-nowrap text-primary-foreground",
        "transition-[background-color,transform] duration-200 ease-out",
        "hover:bg-[color-mix(in_oklch,var(--primary),black_8%)] active:translate-y-px",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        SIZES[size],
        className
      )}
      {...props}
    >
      <span>{label}</span>
      {arrow && (
        <ArrowRight
          className="size-4.5 transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover/pill:translate-x-1"
          strokeWidth={2}
        />
      )}
    </button>
  )
}
