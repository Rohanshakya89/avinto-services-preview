import * as React from "react"
import { ArrowUpRight } from "lucide-react"

import { cn } from "cn"

type ChipButtonProps = React.ComponentProps<"button"> & {
  label: string
  size?: "sm" | "lg"
}

const SIZES = {
  sm: {
    root: "h-9 gap-2 py-1 pr-1 pl-4 text-sm",
    chip: "size-7",
    icon: "size-4",
  },
  lg: {
    root: "h-12 gap-3 py-1 pr-1 pl-5 text-base",
    chip: "size-10",
    icon: "size-5",
  },
} as const

export function ChipButton({
  label,
  size = "lg",
  className,
  ...props
}: ChipButtonProps) {
  const s = SIZES[size]

  return (
    <button
      type="button"
      className={cn(
        "group/cta inline-flex items-center rounded-full bg-primary font-medium text-primary-foreground",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.14)_inset] transition-[background-color,transform] duration-200 ease-out",
        "hover:bg-[color-mix(in_oklch,var(--primary),white_6%)] active:translate-y-px",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        s.root,
        className
      )}
      {...props}
    >
      <span>{label}</span>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary",
          s.chip
        )}
      >
        <ArrowUpRight
          className={cn(
            "transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover/cta:rotate-45",
            s.icon
          )}
          strokeWidth={2.5}
        />
      </span>
    </button>
  )
}
