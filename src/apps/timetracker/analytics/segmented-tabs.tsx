import type * as React from "react"

import { cn } from "cn"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * The one filter style used across the analytics page (the trends groups and
 * the "Needs attention" checks): a grey track with a raised active button.
 *   Light theme: the active button is white.
 *   Dark theme:  it is a soft brand-blue tint instead.
 * Use inside <Tabs>; extra padding makes each button easy to hit.
 */
export function SegmentedList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return <TabsList className={cn("h-12 w-fit p-1", className)} {...props} />
}

export function SegmentedTab({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        // `!` so the tint wins over the tabs component's own `dark:` styling.
        "px-6 tt-dark:data-active:border-transparent! tt-dark:data-active:bg-primary/20! tt-dark:data-active:text-foreground",
        className
      )}
      {...props}
    />
  )
}
